# Email Signup Module

A boilerplate Express server with base markup, CSS, and JS for an Email Signup
module. There's an exposed endpoint to test success and error states.

---

## Installation

```sh
npm i
```

---

## Starting app

```sh
# prod
npm run app

# dev - watches for file changes
npm run app -- --dev
# OR
npm run app -- -d
```

---

## Dev

Entering data can be a bit tedious during testing so you can use the below
bookmarklet to ease the pain.

```
javascript:(function(){ emailSignup.els.emailSignupModal.querySelector('[name="email"]').value = 'a@b.com'; emailSignup.els.emailSignupModal.querySelector('[name="dob"]').value = '1980-01-01'; emailSignup.els.emailSignupModal.querySelector('[name="gender"]').checked = true; })();
```