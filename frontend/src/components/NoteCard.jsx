import React, { useState } from "react";

const NoteCard = ({ note, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-blue-500/10 hover:border-gray-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 flex items-start justify-between">
          <span className="line-clamp-1">{note.title}</span>
          {isHovered && (
            <span className="text-xs text-blue-400 bg-blue-900 bg-opacity-30 px-2 py-1 rounded-full ml-2">
              {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
            </span>
          )}
        </h3>
        
        {/* Content */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {note.content}
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-700">
          <button
            onClick={() => onEdit(note)}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="flex items-center bg-red-900 bg-opacity-30 hover:bg-opacity-40 text-red-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;