// Get DOM elements
const noteText = document.getElementById('noteText');
const addNoteBtn = document.getElementById('addNote');
const notesContainer = document.getElementById('notesContainer');

// Load existing notes from localStorage
let notes = JSON.parse(localStorage.getItem('gameNotes')) || [];

// Function to format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Function to save notes to localStorage
function saveNotes() {
    localStorage.setItem('gameNotes', JSON.stringify(notes));
}

// Function to create a note element
function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    
    const timestamp = document.createElement('div');
    timestamp.className = 'note-timestamp';
    timestamp.textContent = formatDate(new Date(note.timestamp));
    
    const content = document.createElement('div');
    content.className = 'note-content';
    content.textContent = note.text;
    
    noteDiv.appendChild(timestamp);
    noteDiv.appendChild(content);
    
    return noteDiv;
}

// Function to add a new note
function addNote() {
    const text = noteText.value.trim();
    if (text) {
        const note = {
            text,
            timestamp: new Date().toISOString()
        };
        
        notes.unshift(note); // Add to beginning of array
        saveNotes();
        
        // Add to DOM
        notesContainer.insertBefore(
            createNoteElement(note),
            notesContainer.firstChild
        );
        
        // Clear input
        noteText.value = '';
    }
}

// Event listeners
addNoteBtn.addEventListener('click', addNote);
noteText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addNote();
    }
});

// Load existing notes on page load
window.addEventListener('load', () => {
    notes.forEach(note => {
        notesContainer.appendChild(createNoteElement(note));
    });
});