import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'
import "./pdfupload.css"
import "./Table.jsx"
import { getDecksByUser } from "@/services/deckService.js"
import EnhancedTable from './Table.jsx';
import { deleteFile } from "@/services/fileService.js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const PDFUploads = () => {
    const [files, setFiles] = useState({
        fileId: [],
        name: [],
        uploadedAt: [],
        size: [],
        flashcards: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserPDF = async () => {
        try {
            // Get authenticated user information
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError) {
                throw new Error(authError.message);
            }

            if (user) {
                // Get authenticated user's pdf uploads
                const { data: files, error: pdfError } = await supabase
                    .from('files')
                    .select(`id, name, uploaded_at, size`)
                    .eq('user_id', user.id)

                // Get auth user's decks
                const userDecks = await getDecksByUser(user.id)
                const filesWithCards = userDecks.map(deck => ({
                    file_id: deck.file_id,
                    flashcards_count: deck.flashcards_count
                }))

                if (pdfError) {
                    throw new Error(pdfError.message);
                }
                //Set attributes for files
                const ids = files.map(file => file.id);
                const names = files.map(file => file.name);
                const uploadDates = files.map(file => file.uploaded_at);
                const sizes = files.map(file => Math.ceil(file.size / 1000));
                const cards = new Array(ids.length).fill(0)

                // if a file is associated with a deck, than change their card count to flashcards_count
                ids.forEach((id, index) => {
                    const matchedItem = filesWithCards.find(item => item.file_id === id);
                    // If file id corresponds to a decks file id, update its corresponding card count
                    if (matchedItem) {
                        cards[index] = matchedItem.flashcards_count;
                    }
                });
                // Reformat dates to proper Mon Day, Year
                uploadDates.forEach((date, index) => {
                    const old_date = new Date(date);
                    const new_date = new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }).format(old_date);

                    uploadDates[index] = new_date;
                })

                setFiles({
                    fileId: ids,
                    name: names,
                    uploadedAt: uploadDates,
                    size: sizes,
                    flashcards: cards
                });


            } else {
                // Set all to null, no user is logged in
                setFiles(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUserPDF();
    }, []);

    // Function to delete a row
    const handleDelete = async (fileId) => {
        try {
            await deleteFile(fileId);
            fetchUserPDF();
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <div className='table-container'>
            <EnhancedTable data={files} onDelete={handleDelete} />
        </div>
    )
}



export default PDFUploads