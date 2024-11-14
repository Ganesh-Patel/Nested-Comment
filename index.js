let comments = [];

// Function to reset the page (clear all comments)
function resetPage() {
  comments = [];
  renderComments();
}

// Function to add a comment or reply
function addComment(parentId = null) {
  const usernameInput = document.getElementById('username-input');
  const commentInput = document.getElementById('new-comment-input');
  
  const username = usernameInput.value.trim();
  const commentText = commentInput.value.trim();

  // Validate input
  if (!username || !commentText) {
    alert("Please enter a username and a comment.");
    return;
  }

  const newComment = {
    id: Date.now(),
    username,
    text: commentText,
    replies: [],
    isEditing: false, // For tracking if the comment is being edited
  };

  if (parentId) {
    const parentComment = findCommentById(parentId);
    parentComment.replies.push(newComment);
  } else {
    comments.push(newComment);
  }

  // Clear inputs
  usernameInput.value = '';
  commentInput.value = '';
  
  renderComments();
}

// Function to find a comment by its ID
function findCommentById(id) {
  const searchComments = (comments) => {
    for (let comment of comments) {
      if (comment.id === id) return comment;
      const found = searchComments(comment.replies);
      if (found) return found;
    }
    return null;
  };

  return searchComments(comments);
}

// Function to delete a comment or reply
function deleteComment(id) {
  const deleteRecursive = (comments, id) => {
    const index = comments.findIndex(comment => comment.id === id);
    if (index !== -1) {
      comments.splice(index, 1);
      return true;
    }
    for (let comment of comments) {
      if (deleteRecursive(comment.replies, id)) return true;
    }
    return false;
  };

  deleteRecursive(comments, id);
  renderComments();
}

// Function to handle the editing of a comment or reply
function editComment(id) {
  const comment = findCommentById(id);
  comment.isEditing = true; // Mark as editing
  console.log('here you are going to edit text ')
  // Re-render to show the editing input
  renderComments();
}

// Function to save the edited comment
function saveEdit(id) {
  const comment = findCommentById(id);
  const newText = document.getElementById(`edit-input-${id}`).value.trim();
  
  if (newText) {
    comment.text = newText;
    comment.isEditing = false; // Mark as no longer editing
  }
  
  renderComments();
}

// Function to render comments
function renderComments() {
  const commentSection = document.getElementById('comment-section');
  commentSection.innerHTML = ''; // Clear the section before re-rendering
  
  comments.forEach(comment => {
    const commentCard = createCommentCard(comment);
    commentSection.appendChild(commentCard);
  });
}

// Create a card for each comment
function createCommentCard(comment) {
  const card = document.createElement('div');
  card.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'space-y-4');
  card.setAttribute('data-id', comment.id); // Set data-id for easy targeting
  
  // User Avatar and Username
  const header = document.createElement('div');
  header.classList.add('flex', 'items-center', 'space-x-4');
  
  const avatar = document.createElement('img');
  avatar.src = "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png";
  avatar.alt = "User Avatar";
  avatar.classList.add('w-10', 'h-10', 'rounded-full');
  
  const username = document.createElement('span');
  username.classList.add('font-semibold', 'text-gray-800');
  username.textContent = comment.username;

  header.appendChild(avatar);
  header.appendChild(username);
  
  // Comment Text or Edit Input
  const text = document.createElement('p');
  text.classList.add('text-gray-700');
  
  // If editing, show input
  if (comment.isEditing) {
    const editInput = document.createElement('input');
    editInput.id = `edit-input-${comment.id}`;
    editInput.type = 'text';
    editInput.value = comment.text;
    editInput.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-lg');
    
    text.replaceWith(editInput); // Replace the text with the input
  } else {
    text.textContent = comment.text;
  }
  
  // Buttons (Reply, Edit, Delete)
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('flex', 'space-x-4');
  
  const replyButton = document.createElement('button');
  replyButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-blue-600');
  replyButton.textContent = 'Reply';
  replyButton.addEventListener('click', () => showReplyInput(comment.id));

  const editButton = document.createElement('button');
  editButton.classList.add('bg-yellow-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-yellow-600');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editComment(comment.id));

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-red-600');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteComment(comment.id));

  buttonContainer.appendChild(replyButton);
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  // Reply Input Section (only shown when replying)
  const replyInputSection = document.createElement('div');
  replyInputSection.classList.add('mt-4', 'hidden');
  replyInputSection.setAttribute('data-id', comment.id); // Set parent ID to reply
  
  const replyUsernameInput = document.createElement('input');
  replyUsernameInput.type = 'text';
  replyUsernameInput.placeholder = 'Your name';
  replyUsernameInput.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-lg');
  
  const replyTextInput = document.createElement('input');
  replyTextInput.type = 'text';
  replyTextInput.placeholder = 'Write a reply...';
  replyTextInput.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-lg');

  const addReplyButton = document.createElement('button');
  addReplyButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-blue-600');
  addReplyButton.textContent = 'Add Reply';
  addReplyButton.addEventListener('click', () => addReply(comment.id, replyUsernameInput.value, replyTextInput.value));
  
  const cancelReplyButton = document.createElement('button');
  cancelReplyButton.classList.add('bg-gray-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-gray-600');
  cancelReplyButton.textContent = 'Cancel';
  cancelReplyButton.addEventListener('click', hideReplyInput);

  replyInputSection.appendChild(replyUsernameInput);
  replyInputSection.appendChild(replyTextInput);
  replyInputSection.appendChild(addReplyButton);
  replyInputSection.appendChild(cancelReplyButton);
  
  // Replies Section (if any)
  const repliesSection = document.createElement('div');
  repliesSection.classList.add('ml-10');
  comment.replies.forEach(reply => {
    const replyCard = createCommentCard(reply);
    repliesSection.appendChild(replyCard);
  });
  
  card.appendChild(header);
  card.appendChild(text);
  card.appendChild(buttonContainer);
  card.appendChild(replyInputSection);
  card.appendChild(repliesSection);
  
  return card;
}

// Show input field for replying to a comment
function showReplyInput(commentId) {
  const commentCard = document.querySelector(`[data-id="${commentId}"]`);
  const replyInputSection = commentCard.querySelector('[data-id]');
  replyInputSection.classList.remove('hidden');
}

// Hide the reply input field
function hideReplyInput() {
  const allReplySections = document.querySelectorAll('.mt-4');
  allReplySections.forEach(section => {
    section.classList.add('hidden');
  });
}

// Add a reply to a comment
function addReply(parentId, username, text) {
  if (!username.trim() || !text.trim()) {
    alert("Please enter a valid reply.");
    return;
  }

  const parentComment = findCommentById(parentId);
  const newReply = {
    id: Date.now(),
    username,
    text,
    replies: [],
    isEditing: false,
  };

  parentComment.replies.push(newReply);
  hideReplyInput();
  renderComments();
}

// Event listener for the "Add Comment" button
document.getElementById('add-comment-btn').addEventListener('click', () => addComment());

// Event listener for the "Reset" button
document.getElementById('reset-btn').addEventListener('click', resetPage);

// Initial call to render comments on page load
renderComments();
