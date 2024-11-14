// Initialize the comment section
const commentSection = document.getElementById('comment-section');
const newCommentInput = document.getElementById('new-comment-input');
const charCounter = document.getElementById('char-counter');

// Update character counter on input
newCommentInput.addEventListener('input', () => {
  const remaining = 250 - newCommentInput.value.length;
  charCounter.textContent = `${remaining} characters left`;
});

// Function to add a new comment
function addComment() {
  if (newCommentInput.value.trim() === '') return;
  const comment = createComment(newCommentInput.value);
  commentSection.appendChild(comment);
  newCommentInput.value = '';
  charCounter.textContent = '250 characters left';
}

// Function to create a comment element with reply, edit, and delete capability
function createComment(text) {
  const commentContainer = document.createElement('div');
  commentContainer.classList.add('bg-gray-100', 'p-4', 'rounded-lg', 'space-y-2', 'shadow-md');

  // Profile picture and comment content
  const commentHeader = document.createElement('div');
  commentHeader.classList.add('flex', 'items-center', 'space-x-4');

  const profilePic = document.createElement('img');
  profilePic.src = "https://via.placeholder.com/40";
  profilePic.alt = "Profile";
  profilePic.classList.add('w-10', 'h-10', 'rounded-full', 'border-2', 'border-white');

  const commentText = document.createElement('p');
  commentText.classList.add('text-gray-800', 'text-lg');
  commentText.textContent = text;

  commentHeader.append(profilePic, commentText);

  // Action buttons (Reply, Edit, Delete)
  const actionButtons = document.createElement('div');
  actionButtons.classList.add('flex', 'space-x-4', 'mt-2');

  const replyButton = document.createElement('button');
  replyButton.classList.add('text-blue-500', 'hover:underline');
  replyButton.textContent = 'Reply';
  replyButton.addEventListener('click', () => toggleReplyInput(replyContainer));

  const editButton = document.createElement('button');
  editButton.classList.add('text-yellow-500', 'hover:underline');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editComment(commentText));

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('text-red-500', 'hover:underline');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteComment(commentContainer));

  actionButtons.append(replyButton, editButton, deleteButton);

  const repliesContainer = document.createElement('div');
  repliesContainer.classList.add('space-y-2', 'ml-6');

  const replyContainer = document.createElement('div');
  replyContainer.classList.add('mt-2', 'space-y-2', 'hidden');

  const replyInput = document.createElement('textarea');
  replyInput.classList.add('w-full', 'p-2', 'border', 'rounded');
  replyInput.placeholder = 'Write a reply...';
  replyInput.maxLength = 250;

  const replyCounter = document.createElement('span');
  replyCounter.classList.add('text-sm', 'text-gray-500');
  replyCounter.textContent = '250 characters left';
  replyContainer.appendChild(replyInput);
  replyContainer.appendChild(replyCounter);

  replyInput.addEventListener('input', () => {
    replyCounter.textContent = `${250 - replyInput.value.length} characters left`;
  });

  const submitReplyButton = document.createElement('button');
  submitReplyButton.classList.add('bg-blue-500', 'text-white', 'px-2', 'py-1', 'rounded', 'hover:bg-blue-600');
  submitReplyButton.textContent = 'Reply';
  submitReplyButton.addEventListener('click', () => {
    if (replyInput.value.trim()) {
      const reply = createComment(replyInput.value);
      repliesContainer.appendChild(reply);
      replyInput.value = '';
      replyCounter.textContent = '250 characters left';
    }
  });

  replyContainer.appendChild(submitReplyButton);
  commentContainer.append(commentHeader, actionButtons, repliesContainer, replyContainer);

  return commentContainer;
}

// Function to toggle reply input visibility
function toggleReplyInput(replyContainer) {
  replyContainer.classList.toggle('hidden');
}

// Function to edit comment text
function editComment(commentTextElement) {
  const newText = prompt("Edit your comment:", commentTextElement.textContent);
  if (newText !== null && newText.trim() !== '') {
    commentTextElement.textContent = newText;
  }
}

// Function to delete a comment
function deleteComment(commentContainer) {
  if (confirm("Are you sure you want to delete this comment?")) {
    commentContainer.remove();
  }
}

// Reset the page (clear all comments)
function resetPage() {
  if (confirm("Are you sure you want to reset the page? All comments will be lost.")) {
    commentSection.innerHTML = '';
    newCommentInput.value = '';
    charCounter.textContent = '250 characters left';
  }
}
