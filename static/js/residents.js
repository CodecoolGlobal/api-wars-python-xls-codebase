$(function() {
    addLabels()
    mobileTableCheck();
    $(window).on('resize', mobileTableCheck);

    function addLabels() {
        let labels = [];
        $('#planet-table th').each(function() {
            labels.push($(this).html())
        })
        $('#planet-table tr').each( function() {
            $(this).find('td').not(':last').each(function (i) {
                $(this).prepend('<span class="label">' + labels[i] + ': </span>')
            })
        })
        // $('#planet-table .label').hide()
    }

    function mobileTableCheck() {
        if (window.matchMedia("only screen and (max-width: 576px)").matches) {
            $('#planet-table tr').addClass('row');
            $('#planet-table th, #planet-table td').addClass('col-');
            $('#planet-table').closest('div').removeClass('table-responsive')
            $('#planet-table thead').hide()
            $('#planet-table .label').show()
            $('.pagination').addClass('d-flex justify-content-between')
            $('.pagination .btn').addClass('col-5')
            $('#planet-table tr td:last-child .btn').addClass('d-grid')
            $('#planet-table > :not(:first-child)').addClass('no-border')
        } else {
            $('#planet-table tr').removeClass('row');
            $('#planet-table th, #planet-table td').removeClass('col-');
            $('#planet-table').closest('div').addClass('table-responsive')
            $('#planet-table thead').show()
            $('#planet-table .label').hide()
            $('.pagination').removeClass('d-flex justify-content-between')
            $('.pagination .btn').removeClass('col-5')
            $('#planet-table tr td:last-child .btn').removeClass('d-grid')
            $('#planet-table > :not(:first-child)').removeClass('no-border')
        }
    }

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