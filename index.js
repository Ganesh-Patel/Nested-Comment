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

// Function to create a comment element with reply capability
function createComment(text) {
  const commentContainer = document.createElement('div');
  commentContainer.classList.add('bg-gray-100', 'p-4', 'rounded-lg', 'space-y-2');

  const commentText = document.createElement('p');
  commentText.classList.add('text-gray-800');
  commentText.textContent = text;

  const replyButton = document.createElement('button');
  replyButton.classList.add('text-blue-500', 'hover:underline');
  replyButton.textContent = 'Reply';
  replyButton.addEventListener('click', () => toggleReplyInput(replyContainer));

  const repliesContainer = document.createElement('div');
  repliesContainer.classList.add('space-y-2', 'ml-6');

  const replyContainer = document.createElement('div');
  replyContainer.classList.add('mt-2', 'space-y-2', 'hidden');

  const replyInput = document.createElement('textarea');
  replyInput.classList.add('w-full', 'p-2', 'border', 'rounded');
  replyInput.placeholder = 'Write a reply...';
  replyInput.maxLength = 250;
  replyContainer.appendChild(replyInput);

  const replyCounter = document.createElement('span');
  replyCounter.classList.add('text-sm', 'text-gray-500');
  replyCounter.textContent = '250 characters left';
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
  commentContainer.append(commentText, replyButton, repliesContainer, replyContainer);

  return commentContainer;
}

// Function to toggle reply input visibility
function toggleReplyInput(replyContainer) {
  replyContainer.classList.toggle('hidden');
}
