# Contributing

Looking to contribute? You've come to the right place! We welcome pull requests, issues, feedback, etc., and have a few guidelines for contributions:

##### To maximize the visibility and reviewability of code, all code contributions are made through pull requests.

### Contributing Pull Requests

- Follow ESLint/CSSLint best practices. Enforced by Code Climate, `semistandard`, and `stylelint`.
- **Include tests that test the range of behavior that changes with your PR.** If your PR fixes a bug, make sure your tests capture that bug. If your PR adds new behavior, make sure that behavior is fully tested. Every PR must include associated tests (unit, component, acceptance) as appropriate.
- Update any associated documentation affected by your change.
- Submit your PR, making sure it references any relevant issues, including links, as necessary.
- Ensure your pull request description accurately describes the changes you are proposing. See [short reason](https://twitter.com/dzaporozhets/status/870268536404533249) and [long reason](https://medium.com/square-corner-blog/how-square-writes-commit-messages-8e92fcbf77c9).

### Merging Pull Requests

- The default merge mode should be **squash and merge**. **rebase and merge** is also permissible, provided that commits are atomic in nature.
- Pure merges should **never** be done. This unnecessarily clutters GitHub history, and shows the wrong information in various integrations.
- NOTE: When using the GitHub web interface, it automatically selects your last-performed merge type, so be careful when clicking the button.
- **Delete the PR branch** after merging.
