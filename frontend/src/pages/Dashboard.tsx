// src/pages/Dashboard/Dashboard.tsx

import { Box, Button, Typography, IconButton, Card, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/userService";
import Icon from "../assets/icon.png";
import { useNavigate } from "react-router-dom";

interface Note {
    _id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface NotesObjectPayload {
    notes: Note[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
}

function isNotesObjectPayload(data: unknown): data is NotesObjectPayload {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return Array.isArray(obj.notes);
}

// ✅ Styled components
const Container = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: "1rem",
    background: "#fff",
    [theme.breakpoints.up("md")]: {
        padding: "2rem 4rem",
    },
}));

const Header = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
}));

const LogoWrapper = styled(Box)(() => ({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
}));

const Logo = styled("img")(() => ({
    width: "28px",
    height: "28px",
}));

const WelcomeCard = styled(Card)(() => ({
    padding: "1.25rem",
    borderRadius: "12px",
    marginBottom: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
}));

const NotesWrapper = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
}));

const NoteCard = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
}));

// ✅ Component
const Dashboard = () => {
    const { user, setAuthState } = useAuth();
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    const [createOpen, setCreateOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    const fetchNotes = useCallback(async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getNotes({ page, limit });
            if (response.success) {
                const payload = response.data as unknown;
                const list: Note[] = Array.isArray(payload)
                    ? (payload as Note[])
                    : isNotesObjectPayload(payload)
                        ? payload.notes
                        : [];
                setNotes(list || []);

                if (response.pagination) {
                    setPagination({
                        page: response.pagination.page,
                        limit: response.pagination.limit,
                        total: response.pagination.total,
                        totalPages: response.pagination.totalPages
                    });
                }
            } else {
                setNotes([]);
            }
        } catch (err) {
            const anyErr = err as { status?: number; message?: string };
            if (anyErr && anyErr.status === 401) {
                setAuthState({ isAuthenticated: false, user: null });
                navigate('/signin', { replace: true });
                return;
            }
            const errorMessage = anyErr?.message || 'Failed to fetch notes';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [navigate, setAuthState]);

    useEffect(() => {
        fetchNotes(pagination.page, pagination.limit);
    }, [fetchNotes, pagination.page, pagination.limit]);

    const handleDelete = async (noteId: string) => {
        try {
            await userService.deleteNote(noteId);
            await fetchNotes(pagination.page, pagination.limit);
        } catch (err) {
            const anyErr = err as { status?: number; message?: string };
            if (anyErr && anyErr.status === 401) {
                setAuthState({ isAuthenticated: false, user: null });
                navigate('/signin', { replace: true });
                return;
            }
            const errorMessage = anyErr?.message || 'Failed to delete note';
            setError(errorMessage);
        }
    };

    const openCreate = () => {
        setContent("");
        setIsEditing(false);
        setEditingNoteId(null);
        setCreateOpen(true);
    };

    const openEdit = (note: Note) => {
        setContent(note.content);
        setIsEditing(true);
        setEditingNoteId(note._id);
        setCreateOpen(true);
    };

    const closeCreate = () => {
        if (!createLoading) setCreateOpen(false);
    };

    const submitCreateOrEdit = async () => {
        try {
            setCreateLoading(true);
            if (isEditing && editingNoteId) {
                await userService.updateNote(editingNoteId, { content });
            } else {
                await userService.createNote({ content });
            }
            setCreateOpen(false);
            setContent("");
            setIsEditing(false);
            setEditingNoteId(null);
            await fetchNotes(pagination.page, pagination.limit);
        } catch (err) {
            const anyErr = err as { status?: number; message?: string };
            if (anyErr && anyErr.status === 401) {
                setAuthState({ isAuthenticated: false, user: null });
                navigate('/signin', { replace: true });
                return;
            }
            const errorMessage = anyErr?.message || (isEditing ? 'Failed to update note' : 'Failed to create note');
            setError(errorMessage);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <Container>
            {/* Header */}
            <Header>
                <LogoWrapper>
                    <Logo src={Icon} alt="logo" />
                    <Typography variant="h6" fontWeight="bold">
                        Dashboard
                    </Typography>
                </LogoWrapper>
                <Typography
                    variant="body2"
                    sx={{ color: "#2563eb", fontWeight: 500, cursor: "pointer" }}
                >
                    Sign Out
                </Typography>
            </Header>

            {/* Welcome Section */}
            <WelcomeCard>
                <Typography variant="h6" fontWeight="bold">
                    Welcome, {user?.fullName || user?.name || 'User'} !
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={2}>
                    Email: {user?.email || 'N/A'}
                </Typography>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ background: "#2563eb", textTransform: "none", fontWeight: 600 }}
                    onClick={openCreate}
                >
                    Create Note
                </Button>
            </WelcomeCard>

            {/* Notes List */}
            <Typography variant="h6" fontWeight="bold" mb={1}>
                Notes
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error" my={4}>
                    {error}
                </Typography>
            ) : (
                <NotesWrapper>
                    {notes.length === 0 ? (
                        <Typography color="textSecondary" textAlign="center" my={4}>
                            No notes found. Create your first note!
                        </Typography>
                    ) : (
                        notes.map((note) => (
                            <NoteCard key={note._id}>
                                <Box>
                                    <Typography>{note.content}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Created: {new Date(note.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                                <Box>
                                    <IconButton onClick={() => openEdit(note)} sx={{ mr: 1 }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(note._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </NoteCard>
                        ))
                    )}
                </NotesWrapper>
            )}

            {/* Create/Edit Note Dialog */}
            <Dialog open={createOpen} onClose={closeCreate} fullWidth maxWidth="lg">
                <DialogTitle>{isEditing ? 'Edit note' : 'Create a new note'}</DialogTitle>
                <DialogContent sx={{ minHeight: 300 }}>
                    <TextField
                        label="Content"
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                        multiline
                        minRows={10}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeCreate} disabled={createLoading}>Cancel</Button>
                    <Button onClick={submitCreateOrEdit} variant="contained" disabled={createLoading || content.trim().length === 0}>
                        {createLoading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Dashboard;
