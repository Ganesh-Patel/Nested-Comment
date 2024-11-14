let comments = [];

// Function to reset the page (clear all comments)
function resetPage() {
  comments = [];
  renderComments();
}

// Function to add a comment or reply
function addComment(parentId = null, username = null, commentText = null) {
  if (parentId) {
    // For replies, get the username and commentText from the reply input fields
    username = document.getElementById(`reply-username-${parentId}`).value.trim();
    commentText = document.getElementById(`reply-text-${parentId}`).value.trim();
  } else {
    // For main comments, get username and commentText from the main input fields
    username = document.getElementById('username-input').value.trim();
    commentText = document.getElementById('new-comment-input').value.trim();
  }

  if (!username || !commentText) {
    alert("Please enter a username and a comment.");
    return;
  }

  const newComment = {
    id: Date.now(),
    username,
    text: commentText,
    replies: [],
    isEditing: false,
  };

  if (parentId) {
    const parentComment = findCommentById(parentId);
    parentComment.replies.push(newComment);
  } else {
    comments.push(newComment);
  }

  // Clear inputs after adding the comment
  if (parentId) {
    document.getElementById(`reply-username-${parentId}`).value = '';
    document.getElementById(`reply-text-${parentId}`).value = '';
  } else {
    document.getElementById('username-input').value = '';
    document.getElementById('new-comment-input').value = '';
  }

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

// Function to toggle editing mode for a comment or reply
function editComment(id) {
  const comment = findCommentById(id);

  if (comment.isEditing) {
    const newText = document.getElementById(`edit-input-${id}`).value.trim();
    if (newText) {
      comment.text = newText;
    }
    comment.isEditing = false;
  } else {
    comment.isEditing = true;
  }

  renderComments();
}

// Function to render comments
function renderComments() {
  const commentSection = document.getElementById('comment-section');
  commentSection.innerHTML = ''; 
  
  comments.forEach(comment => {
    const commentCard = createCommentCard(comment);
    commentSection.appendChild(commentCard);
  });
}

// Function to create a comment or reply card
function createCommentCard(comment) {
  const card = document.createElement('div');
  card.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'space-y-4');
  card.setAttribute('data-id', comment.id);
  
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
  
  const textSection = document.createElement('div');
  textSection.classList.add('text-gray-700');
  
  if (comment.isEditing) {
    const editInput = document.createElement('input');
    editInput.id = `edit-input-${comment.id}`;
    editInput.type = 'text';
    editInput.value = comment.text;
    editInput.classList.add('w-full', 'p-3', 'border', 'border-gray-300', 'rounded-lg');
    textSection.appendChild(editInput);
  } else {
    textSection.textContent = comment.text;
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('flex', 'space-x-4');
  
  const replyButton = document.createElement('button');
  replyButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-blue-600');
  replyButton.textContent = 'Reply';
  replyButton.addEventListener('click', () => showReplyInput(comment.id));

  const editButton = document.createElement('button');
  editButton.classList.add('bg-yellow-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-yellow-600');
  editButton.textContent = comment.isEditing ? 'Save' : 'Edit';
  editButton.addEventListener('click', () => editComment(comment.id));

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('bg-red-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-red-600');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteComment(comment.id));

  buttonContainer.appendChild(replyButton);
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  const repliesSection = document.createElement('div');
  repliesSection.classList.add('ml-10');
  comment.replies.forEach(reply => {
    const replyCard = createCommentCard(reply);
    repliesSection.appendChild(replyCard);
  });
  
  card.appendChild(header);
  card.appendChild(textSection);
  card.appendChild(buttonContainer);
  card.appendChild(repliesSection);
  
  return card;
}

// Show input field for replying to a comment
function showReplyInput(commentId) {
  const commentCard = document.querySelector(`[data-id="${commentId}"]`);

  let replyInputSection = commentCard.querySelector('.reply-input-section');
  if (!replyInputSection) {
    replyInputSection = document.createElement('div');
    replyInputSection.classList.add('reply-input-section', 'space-y-2', 'mt-2');
    
    const replyUsernameInput = document.createElement('input');
    replyUsernameInput.id = `reply-username-${commentId}`;
    replyUsernameInput.type = 'text';
    replyUsernameInput.placeholder = 'Your name';
    replyUsernameInput.classList.add('w-full', 'p-2', 'border', 'rounded-lg');

    const replyTextInput = document.createElement('input');
    replyTextInput.id = `reply-text-${commentId}`;
    replyTextInput.type = 'text';
    replyTextInput.placeholder = 'Your reply';
    replyTextInput.classList.add('w-full', 'p-2', 'border', 'rounded-lg');

    const replyButton = document.createElement('button');
    replyButton.classList.add('bg-green-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-green-600');
    replyButton.textContent = 'Reply';
    replyButton.addEventListener('click', () => {
      addComment(commentId);
    });

    replyInputSection.appendChild(replyUsernameInput);
    replyInputSection.appendChild(replyTextInput);
    replyInputSection.appendChild(replyButton);

    commentCard.appendChild(replyInputSection);
  }
}

// Event listeners
document.getElementById('add-comment-btn').addEventListener('click', () => addComment());
document.getElementById('reset-btn').addEventListener('click', resetPage);

renderComments();
