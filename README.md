# Email Signup Module

An un-opinionated server setup, with base markup, CSS, and JS for an Email
Signup module.

The purpose of this repo is a sandbox for testing out new JS frameworks, much
like the ToDo List app. The server is built in **Express**, and the endpoint for
server submissions points to a **Firebase** database.

Suggested usage for this repo would be to clone, and then create a branch named
`React` (for example). In that branch you'd go about installing all the modules
you'd need for your chosen framework, and re-structuring however you see fit.

The server automatically finds an open port to run on (within a certain range),
so you could have multiple branches with `React`, `Riot`, `Mithril`, etc., all
running at once for comparison.

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

```js
javascript:(function(){ emailSignup.els.emailSignupModal.querySelector('[name="email"]').value = 'a@b.com'; emailSignup.els.emailSignupModal.querySelector('[name="dob"]').value = '1980-01-01'; emailSignup.els.emailSignupModal.querySelector('[name="gender"]').checked = true; })();
```