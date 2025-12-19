$(function() {
    const API_BASE = 'https://jsonplaceholder.typicode.com';
    const POSTS_ENDPOINT = API_BASE + '/posts';
    let posts = []; // local cache (client-side)
    let isEditing = false;

    // helpers: spinner and toasts
    function showSpinner(show=true){
      $('#spinner').toggle(show);
    }
    function showLoadingBadge(show){
      $('#loadingBadge').toggle(show);
    }

    function showToast(message, type='success', delay=3000){
      const id = 't' + Date.now();
      const toastHtml = `
        <div id="${id}" class="toast align-items-center text-bg-${type} border-0 mb-2" role="alert" aria-live="polite" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>`;
      const $el = $(toastHtml);
      $('#toastContainer').append($el);
      const bsToast = new bootstrap.Toast(document.getElementById(id), { delay });
      bsToast.show();
      // remove DOM after hidden
      $el.on('hidden.bs.toast', function(){ $(this).remove(); });
    }

    // fetch posts (GET)
    function loadPosts(limit=20){
      showSpinner(true);
      showLoadingBadge(true);
      $.get(POSTS_ENDPOINT)
        .done(function(data){
          // JSONPlaceholder returns 100 posts. We'll slice for UI.
          posts = data.slice(0, limit);
          renderPosts();
          showToast('Posts loaded', 'success', 1500);
        })
        .fail(function(){
          showToast('Failed to load posts', 'danger', 4000);
        })
        .always(function(){
          showSpinner(false);
          showLoadingBadge(false);
        });
    }

    // render posts into table
    function renderPosts(){
      const $tbody = $('#postsTable tbody').empty();
      posts.forEach(p => {
        const row = renderRow(p);
        $tbody.append(row);
      });
      $('#count').text(posts.length);
    }

    function renderRow(p){
      const shortTitle = $('<div>').text(p.title).html();
      const $tr = $(`
        <tr data-id="${p.id}">
          <td>${p.id}</td>
          <td>${p.userId}</td>
          <td style="max-width:50ch; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(p.title)}</td>
          <td>
            <div class="btn-group" role="group" aria-label="actions">
              <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
              <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
            </div>
          </td>
        </tr>
      `);
      return $tr;
    }

    // escape to avoid HTML injection
    function escapeHtml(s){ return String(s).replace(/[&<>"'`=\/]/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }

    // Create (POST)
    function createPost(payload){
      showSpinner(true);
      $.ajax({
        url: POSTS_ENDPOINT,
        method: 'POST',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=UTF-8'
      })
      .done(function(res){
        // JSONPlaceholder returns the created resource with an id
        posts.unshift(res); // add to top
        renderPosts();
        showToast('Post created', 'success');
        resetForm();
      })
      .fail(function(){
        showToast('Failed to create post', 'danger');
      })
      .always(function(){ showSpinner(false); });
    }

    // Update (PUT)
    function updatePost(id, payload){
      showSpinner(true);
      $.ajax({
        url: POSTS_ENDPOINT + '/' + id,
        method: 'PUT',
        data: JSON.stringify(payload),
        contentType: 'application/json; charset=UTF-8'
      })
      .done(function(res){
        // replace in local posts array
        const idx = posts.findIndex(p => p.id == id);
        if (idx > -1) posts[idx] = res;
        renderPosts();
        showToast('Post updated', 'success');
        resetForm();
      })
      .fail(function(){
        showToast('Failed to update post', 'danger');
      })
      .always(function(){ showSpinner(false); });
    }

    // Delete (DELETE)
    function deletePost(id){
      showSpinner(true);
      $.ajax({
        url: POSTS_ENDPOINT + '/' + id,
        method: 'DELETE'
      })
      .done(function(){
        posts = posts.filter(p => p.id != id);
        renderPosts();
        showToast('Post deleted', 'success');
      })
      .fail(function(){
        showToast('Failed to delete post', 'danger');
      })
      .always(function(){ showSpinner(false); });
    }

    // UI: reset form
    function resetForm(){
      $('#postId').val('');
      $('#userId').val('');
      $('#title').val('');
      $('#body').val('');
      $('#submitBtn').text('Create').removeClass('btn-warning').addClass('btn-primary');
      $('#form-title').text('Create Post');
      isEditing = false;
    }

    // Prefill form for edit
    function editItem(id){
      const p = posts.find(x => x.id == id);
      if(!p) return showToast('Item not found', 'danger');
      $('#postId').val(p.id);
      $('#userId').val(p.userId);
      $('#title').val(p.title);
      $('#body').val(p.body);
      $('#submitBtn').text('Update').removeClass('btn-primary').addClass('btn-warning');
      $('#form-title').text('Edit Post #' + p.id);
      // scroll to form
      $('html,body').animate({ scrollTop: $('#postForm').offset().top - 20 }, 400);
      isEditing = true;
    }

    // Bind events
    // form submit
    $('#postForm').on('submit', function(e){
      e.preventDefault();

      // basic client-side validation
      const userId = $('#userId').val().trim();
      const title = $('#title').val().trim();
      const body = $('#body').val().trim();

      // simple checks
      if (!userId || !title || !body) {
        showToast('Please fill in all fields', 'warning', 2500);
        // highlight missing fields
        if(!userId) $('#userId').addClass('is-invalid'); else $('#userId').removeClass('is-invalid');
        if(!title) $('#title').addClass('is-invalid'); else $('#title').removeClass('is-invalid');
        if(!body) $('#body').addClass('is-invalid'); else $('#body').removeClass('is-invalid');
        return;
      } else {
        $('#userId,#title,#body').removeClass('is-invalid');
      }

      const payload = {
        userId: parseInt(userId,10),
        title: title,
        body: body
      };

      if (isEditing) {
        const id = $('#postId').val();
        updatePost(id, payload);
      } else {
        createPost(payload);
      }
    });

    // reset button
    $('#resetBtn').on('click', function(){
      resetForm();
    });

    // reload
    $('#reloadBtn').on('click', function(){ loadPosts(); });

    // clear list
    $('#clearBtn').on('click', function(){
      if (!confirm('Remove all posts from the list (client-side only)?')) return;
      posts = [];
      renderPosts();
      showToast('List cleared (client-side)', 'info', 1500);
    });

    // delegate edit/delete buttons
    $('#postsTable tbody').on('click', '.edit-btn', function(){
      const id = $(this).closest('tr').data('id');
      editItem(id);
    });

    $('#postsTable tbody').on('click', '.delete-btn', function(){
      const id = $(this).closest('tr').data('id');
      if (!confirm('Are you sure you want to delete post #' + id + '?')) return;
      deletePost(id);
    });

    // remove is-invalid on input
    $('#postForm').on('input', 'input, textarea', function(){ $(this).removeClass('is-invalid'); });

    // initial load
    loadPosts(20);
  });
