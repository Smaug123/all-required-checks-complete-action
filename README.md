# all-required-checks-complete-action

**This is archived in favour of the [G-Research fork](https://github.com/G-Research/common-actions/tree/33666a03520041a810d377d5b01507df9a5b5d83/check-required-lite).**

A GitHub Action which checks if the given steps have completed successfully.

You must call it as follows.
The `if` clause is essential, as is the `needs-context`.
The only part of this invocation which you vary is the contents of the `needs:` list.

```yaml
all-required-checks-complete:
  needs: [some-previous-step, another-step]
  if: ${{ always() }}
  runs-on: ubuntu-latest
  steps:
    - uses: Smaug123/all-required-checks-complete-action
      with:
        needs-context: ${{ toJSON(needs) }}
```

# Inputs

## `needs-context`

You must supply this, and you should always supply it as `${{ toJSON(needs) }}`.
This is how the action knows which steps we depended on.

# Why?

Because [required status checks are not actually required](https://emmer.dev/blog/skippable-github-status-checks-aren-t-really-required/).
You call this workflow in a step with `if: ${{ always() }}`, so it really *is* required.
