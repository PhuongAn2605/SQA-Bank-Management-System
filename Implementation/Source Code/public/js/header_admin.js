document.querySelector(".header").innerHTML = '<nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background-color:  rgba(79, 89, 148, 0.9)">' +
    '            <a href="/admin"><img src="./images/logo_white.png" width="80" height="80" class="d-inline-block align-top" alt="" loading="lazy"></a>' +
    '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">' +
    '<span class="navbar-toggler-icon"></span>' +
    '</button>' +
    '<div class="collapse navbar-collapse" id="navbarSupportedContent">' +
    '<ul class="navbar-nav mr-auto">' +
    '<li class="nav-item active">' +
    ' <a class="nav-link" href="/home_page">Home<span class="sr-only">(current)</span></a>' +
    '</li> ' +
    '<li class="nav-item dropdown">' +
    '   <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
    '    Administration</a>' +
    ' <ul class="dropdown-menu" aria-labelledby="navbarDropdown">' +
    '<li><a class="dropdown-item" href="/account_create">Add User</a></li>' +
    '<li><a class="dropdown-item" href="/transaction_create">Add Transaction</a></li>' +
    '</ul>' +
    '</li>' +
    '<li class="nav-item dropdown">' +
    '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
    'Report</a>' +
    '<ul class="dropdown-menu" aria-labelledby="navbarDropdown">' +
    ' <li><a class="dropdown-item" href="/account_list">User Report</a></li>' +
    '<li><a class="dropdown-item" href="/transaction_list">Transaction Report</a></li>' +
    '</ul>' +
    '</li>' +
    '</ul>' +
    '<ul class="navbar-nav navbar-right">' +
    '<li class="dropdown">' +
    '<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-user-alt"></i> Admin</span></a>' +
    '<ul class="dropdown-menu">' +
    '<li><a class="dropdown-item" href="/profile"><i class="fas fa-user-alt"></i> My Profile</a></li>' +
    '<li><a class="dropdown-item" href="/sign_out" data-toggle="tooltip" data-placement="top" title="Log out"><i class="fas fa-sign-out-alt"></i> Sign out</a></li>' +
    '</ul>' +
    '</li>' +
    '</ul>' +
    '</nav>';