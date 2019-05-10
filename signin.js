(() => {
  function setSigninState(isSignedIn, imgUrl) {
    const signin = document.getElementById('signin');
    const signout = document.getElementById('signout');
    const userIcon = document.getElementById('userIcon');
    const wrapper = document.getElementById('signinWrapper');
    if (isSignedIn) {
      signin.style.display = 'none';
      signout.style.display = 'block';
      userIcon.src = imgUrl;

      setTimeout(() => {
        signout.style.left = 'calc(100% - 40px)';
        signout.style.top = '8px';
        userIcon.style.width = '32px';

        wrapper.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        wrapper.style.zIndex = '0';
      }, 1000);
    } else {
      signin.style.display = 'block';
      signout.style.display = 'none';

      signout.removeAttribute('style');
      userIcon.removeAttribute('style');
      wrapper.removeAttribute('style');
    }
  }

  function onInit(auth) {
    let imgUrl;
    if (auth.isSignedIn.get()) {
      imgUrl = auth.currentUser.get().getBasicProfile().getImageUrl();
    }
    setSigninState(auth.isSignedIn.get(), imgUrl);
    userChanged(auth.currentUser.get());
    auth.currentUser.listen(userChanged);

    const signout = document.getElementById('signout')
    const anchor = signout.children[0];
    anchor.addEventListener('click', signOut);
  }

  function onInitError(error) {
    alert(`Error initializing Google Authentication library: ${error.error}. Google signin will not be possible.`);
  }

  function onSigninFailure(error) {
    if (error.error === 'popup_closed_by_user') {
      // user intended to cancel; no error
      return;
    }
    alert(`Error signing in: ${error.error}. Cannot play without verifying user identity.`);
  }

  function userChanged(user) {
    let imgUrl;
    if (user.isSignedIn()) {
      imgUrl = user.getBasicProfile().getImageUrl();
      document.getElementById('mainApp').googleUser = user;
    } else {
      document.getElementById('mainApp').googleUser = null;
    }
    setSigninState(user.isSignedIn(), imgUrl);
  }

  function signOut() {
    const result = confirm('Are you certain you want to sign out? Your unsaved progress will be lost.');
    if (result) {
      gapi.auth2.getAuthInstance().signOut();
    }
  }

  function renderButton() {
    gapi.signin2.render('signinButton', {
      scope: 'profile email',
      width: 200,
      height: 64,
      longtitle: false,
      theme: 'light',
      onfailure: onSigninFailure,
    });

    gapi.load('auth2', () => {
      gapi.auth2.init({client_id: '99953346844-92b1h6oj228oo0d6qe7ei5ihfb4tc35r.apps.googleusercontent.com'})
        .then(onInit, onInitError);
    });
  }

  if (document.readyState !== 'loading') renderButton();
  else document.addEventListener('DOMContentLoaded', renderButton);
})();
