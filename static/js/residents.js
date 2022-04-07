$(function() {
    $('.btn-residents').on( 'click', event => {
        event.preventDefault();
        let planetId = $(event.target).data('planet_id')
        showResidents(planetId)
    })
    $('body').prepend(modalHTML)
});

function showResidents(planetId) {
    url = '/planet/' + planetId + '/residents'
    $.get(url, function (data) {
        let title = $(data).find('h2').html();
        let table = $(data).find('.table-responsive');
        $('.modal-title').html(title)
        $('.modal-body').html(table);
        var myModal = new bootstrap.Modal(document.getElementById('residents-modal'))
        myModal.show()
  })
}

modalHTML = `
    <div id="residents-modal" class="modal" tabindex="-1">
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