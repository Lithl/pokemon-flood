(() => {
  let userRef = null;

  /**
   * Set the signed in/out state for the usrer
   * @param {boolean} isSignedIn whether the user is signed in
   * @param {string} imgUrl url to the user's avatar icon
   */
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
        setTimeout(() => {
          wrapper.style.left = 'calc(100% - 48px)';
          wrapper.style.bottom = 'calc(100% - 48px)';
        }, 1000);
      }, 1000);
    } else {
      signin.style.display = 'block';
      signout.style.display = 'none';

      signout.removeAttribute('style');
      userIcon.removeAttribute('style');
      wrapper.removeAttribute('style');
    }
  }

  /**
   * Called when the OAuth initialization is complete
   * @param {GoogleAuth} auth the authentication object
   */
  function onInit(auth) {
    let imgUrl;
    if (auth.isSignedIn.get()) {
      imgUrl = auth.currentUser.get().getBasicProfile().getImageUrl();
    }
    setSigninState(auth.isSignedIn.get(), imgUrl);
    userChanged(auth.currentUser.get());
    auth.currentUser.listen(userChanged);

    const signout = document.getElementById('signout');
    const anchor = signout.children[0];
    anchor.addEventListener('click', signOut);
  }

  /**
   * Called when the Google API fails to initialize
   * @param {string} error the error that caused the failure
   */
  function onInitError(error) {
    alert(`Error initializing Google Authentication library: ${error.error}.
    Google signin will not be possible.`);
  }

  /**
   * Called when the sign in process fails
   * @param {string} error the error that caused the failure
   */
  function onSigninFailure(error) {
    if (error.error === 'popup_closed_by_user') {
      // user intended to cancel; no error
      return;
    }
    alert(`Error signing in: ${error.error}.
    Cannot play without verifying user identity.`);
  }

  /**
   * Called when the currently signed-in user changes
   * @param {GoogleUser?} user the signed-in user
   */
  function userChanged(user) {
    let imgUrl;
    if (user.isSignedIn()) {
      userRef = user;
      imgUrl = user.getBasicProfile().getImageUrl();
      document.getElementById('mainApp').googleUser = user;
    } else {
      userRef = null;
      document.getElementById('mainApp').googleUser = null;
    }
    setSigninState(user.isSignedIn(), imgUrl);
  }

  /**
   * Signs a user out after confirming that's what they want to do
   */
  function signOut() {
    const result = confirm(`Are you certain you want to sign out?
    Your unsaved progress will be lost.`);
    if (result) {
      gapi.auth2.getAuthInstance().signOut();
    }
  }

  /**
   * Renders the signin button with the Google API
   */
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
      gapi.auth2.init({
        client_id: '99953346844-92b1h6oj228oo0d6qe7ei5ihfb4tc35r' +
            '.apps.googleusercontent.com',
      }).then(onInit, onInitError);
    });
  }

  window.getCurrentUser = function getCurrentUser() {
    if (!userRef) return userRef;
    const profile = userRef.getBasicProfile();
    return {
      id: profile.getId(),
      name: profile.getName(),
      givenName: profile.getGivenName(),
      familyName: profile.getFamilyName(),
      email: profile.getEmail(),
      icon: profile.getImageUrl(),
    };
  };

  if (document.readyState !== 'loading') renderButton();
  else document.addEventListener('DOMContentLoaded', renderButton);
})();
