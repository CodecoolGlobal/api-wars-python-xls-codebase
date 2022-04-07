$(function() {
    $('.btn-residents').on( 'click', event => {
        event.preventDefault();
        let planetId = $(event.target).data('planet_id')
        showResidents(planetId)
    })
});

function showResidents(planetId) {
    $('.modal').remove()
    $('body').prepend(modalHTML)
    url = '/planet/' + planetId + '/residents'
    $.get(url, function (data) {
        $('.modal-body').html(data);
        title = $('.modal-body h2').html();
        $('.modal-body h2').remove();
        $('.modal-title').html(title)
        var myModal = new bootstrap.Modal(document.getElementById('my-modal'))
        myModal.show()
  })
}


modalHTML = `
    <div id="my-modal" class="modal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
`