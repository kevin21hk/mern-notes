import React from 'react'

const Home = () => {

    return(
        <>
            <h3>
                6 Easy steps:
            </h3>
           
            <ol className="instructions-ol">
                <li className="instructions-li"><span className="instructions-span">Create Note:</span>
                <br/>
                    Access the 'Create Note' page.
                </li>
                <li className="instructions-li"><span className="instructions-span">Enter Text:</span>
                <br/>
                    Begin by typing or pasting the desired content of your note. This can include any information, reminders, or thoughts you want to save.
                </li>
                <li className="instructions-li"><span className="instructions-span">Enter Title:</span> 
                <br/>
                    Provide a title or heading that summarizes the content of your note. A clear and concise title helps you quickly identify the note's topic.
                </li>
                <li className="instructions-li"><span className="instructions-span">Select Note Privacy:</span> 
                <br/>
                    Choose whether you want the note to be 'Public' or 'Private'. Public notes are visible to anyone who has access to the note's ID and path. Private notes, on the other hand, are password-protected and can only be viewed, edited, and deleted by you.
                </li>
                <li className="instructions-li"><span className="instructions-span">Submit Note:</span> 
                <br/>
                    Once you have finished entering the text and selecting the privacy settings, click the submit button to save your note. This action stores the note in the system, assigning it a unique note ID.
                </li>
                <li className="instructions-li"><span className="instructions-span">Note ID and Path:</span> 
                <br/>
                    After submission, you will be taken to your note which will include a note ID and path. This information can be copied and shared across different devices, allowing you to access your note from anywhere.
                </li>
            </ol>
                   By following these simple steps, you can easily create and manage your notes, ensuring that they are organized, secure, and accessible whenever you need them.
        </>
    )  
}
export default Home