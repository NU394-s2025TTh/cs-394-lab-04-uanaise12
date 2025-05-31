// src/components/NoteList.tsx
import React, { useEffect, useState } from 'react';

import { subscribeToNotes } from '../services/noteService';
// TODO: import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  // TODO: manage state for notes, loading status, and error message
  // TODO: display a loading message while notes are being loaded; error message if there is an error
  //states
  const [notes, setNotes] = useState<Notes>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    try {
      unsubscribe = subscribeToNotes((newNotes) => {
        setNotes(newNotes);
        setLoading(false);
      });
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  //   render
  if (loading) return <p>Loading notes…</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  // Notes is a constant in this template but needs to be a state variable in your implementation and load from firestore
  const noteArray = Object.values(notes).sort((a, b) => b.lastUpdated - a.lastUpdated);

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {Object.values(notes).length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {noteArray.map((note) => (
            <NoteItem key={note.id} note={note} onEdit={onEditNote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
