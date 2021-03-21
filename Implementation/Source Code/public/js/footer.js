document.querySelector(".footer").innerHTML =
'<h6>Contact</h6>'+
'<div class="slogan">We are there for you &nbsp<i class="far fa-smile"></i></div>'+
'<div class="contact">'+
 '   <div class="contact-icon">'+
  '      <span><button type="button" class="btn btn-link" data-bs-toggle="modal"'+
   '             data-bs-target="#staticBackdrop">'+
    '            <i class="fas fa-phone"></i>'+
     '       </button></span>'+
      '  <span><button type="button" class="btn btn-link" data-bs-toggle="modal"'+
       '         data-bs-target="#exampleModal"><i class="fas fa-envelope-square"></i></button>'+
        '</span>'+
        '<span><a href="https://www.facebook.com/BIDVbankvietnam"><i class="fab fa-facebook"></i></a></span>'+
    '</div>'+
    '<div class="message"><button type="button" class="btn btn-link" id="liveToastBtn"><i'+
     '           class="fas fa-comments"></i></button></div>'+
'</div>'+
'</div >'+
  '<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">'+
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
        '<div class="modal-header">'+
          '<h5 class="modal-title" id="exampleModalLabel">Send email to us</h5>'+
          '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
        '</div>'+
        '<div class="modal-body">'+
          '<form>'+
            '<div class="mb-3">'+
              '<label for="recipient-name" class="col-form-label">Recipient:</label>'+
              '<input type="text" class="form-control" id="recipient-name" value="bidv@bank.gmail.com">'+
                '</div>'+
              '<div class="mb-3">'+
                '<label for="message-text" class="col-form-label">Message:</label>'+
                '<textarea class="form-control" id="message-text"></textarea>'+
              '</div>'+
            '</form>'+
        '</div>'+
          '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>'+
            '<button type="button" class="btn btn-success" data-bs-dismiss="modal">Send</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"'+
     'aria-labelledby="staticBackdropLabel" aria-hidden="true">'+
      '<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">'+
        '<div class="modal-content">'+
          '<div class="modal-header">'+
            '<h5 class="modal-title" id="staticBackdropLabel">Contact us via the phone number</h5>'+
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
          '</div>'+
          '<div class="modal-body">'+
            '0987654321'+
        '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
    '<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">'+
      '<div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">'+
        '<div class="toast-header">'+
          '<strong class="me-auto">Support Staff</strong>'+
          '<small>1 min ago</small>'+
          '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>'+
        '</div>'+
        '<div class="toast-body">'+
          '<p>Hello, what do you need?</p>'+
          '<input type="text" class="form-control">'+
    '</div>'+
        '</div>'+
      '</div>';
      // <script>
        let liveModel = document.querySelector("#liveToastBtn");
liveModel.addEventListener("click", function () {
          $('.toast').toast('show');
})
// </script>