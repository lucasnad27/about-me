---
category: 'blog'
cover: './aws-python-trading.png'
title: 'Testing Your Code, Keeping Your Sanity'
description: 'Aligning velocity with stability'
date: '2021-12-07'
tags: ['python', 'testing', 'pytest']
published: true
---

Far too often have I dove headfirst, full of excitement & vigor for a new project. I simply didn't have time to think about building a test framework. I was too busy figuring out business logic and learning about interesting caching mechanisms! Mocking out all of those API calls would just be a drag on my productivity. A few weeks later, I've proven my concept and am ready to get it production-ready. Time to write those tests. In doing so, you realize there are portions of the code that are really tough to test without getting your application's state __just right__ to make a test pass. I find myself coding up `mock.patch` 3 times as often as `assert`. Where did I go wrong?

<mark>Some lessons won't stick until we have the battle scars to remind us of past discretions.</mark> This applies to many of life's lessons, and testing your code is no different. In this episode, we are going to cover what I consider to be the most important tenets of testing, within the context of the python language. Here are a few highlights:

- pytest and its thriving plugin community
- dependency injection FTW!
- mocking non-trivial APIs
- testing the format of your code

Perhaps most importantly, we'll be covering **why we test**. <mark>Without understanding how valuable testing is, you'll always put it off and give it less attention than it deserves.</mark>

# Test-Driven Development

I can't count how many times I've heard a mentor, a blogger, a textbook, or a boss tell me, "write code that is easy to test". Yet, when put in front of a computer and asked to build anything more complex than a TODO app, my code always ended up being a hassle to test. One of the most valuable parts of this entire limited series is [Fun side-project OR Production-quality Application](/blog/production-quality-application-backtest-results/). In it, great detail is provided on how to write _good code_. I'll be building upon those principles. I highly recommend giving that material a once-over before continuing, specifically the "self"-less functions section. If one learns nothing else, let it be the reference to the other episode. That's how important writing good code matters in order to write good tests. Without it, no number of pytest tricks will resolve the fact that you are building on a foundation of sand.

# Pytest fixtures: more than configuration and constants

Fixtures are first-class citizens in the pytest framework. As you've seen in the [code example](https://gist.github.com/lucasnad27/a7243a816ab5ab4c41d983125f7aacc9#file-portfolio_example_2-py-L65) from Fun side-project OR Production-quality Application?, injecting dependencies is one of the most effective ways to avoid a couple of nasty anti-patterns. In the example, you probably noticed three variables that weren't defined anywhere
```python
def test_update_positions(s3_client, s3_bucket, transactions):
```
These are pytest fixtures, injected as needed for test cases. For more information on basic usage and implementation details, please refer to the outstanding [documentation](https://docs.pytest.org). The key benefits to <mark>using fixtures _well_ in your code come down to two features:</mark>

1. **Tests can run faster** - by setting the `scope` kwarg we can indicate when pytest should execute fixtures. More info [here](https://docs.pytest.org/en/6.2.x/fixture.html#scope-sharing-fixtures-across-classes-modules-packages-or-session).
2. **Fewer lines of code** - by implementing all setup/teardown logic in one place and injecting that logic into our functions, we greatly reduce the lines of code it takes to build a test. Less code means less friction to write a large number of valuable tests.

## A few fixture examples...

1. Reading a csv file from disk
```python
@pytest.fixture(scope="module")
def expected_aapl_msft_price_history():
    return pd.read_csv("./path/to.csv", index_col=0, parse_dates=True)
```
2. Mocking functions with constant data
```python
@pytest.fixture()
def mock_equity_universe(mocker, ticker_universe):
    """Returns a fixed list of tickers"""
    with mocker.patch("path.to.mocked.get_universe_of_equities", return_value=ticker_universe):
        yield
```
3. Integrating an AWS mocking library with real data. Jump to [the code](https://github.com/lucasnad27/quality-momentum/blob/c75e9735bc1a0f49f73d34fc4ed35a469d28d938/tests/conftest.py#L99) to see the implementation

## A more advanced example

If the previous examples haven't convinced you to inject more dependencies into your functions, let's take some rather mediocre code from zero to hero, with dependency injection playing a pivotal role. I'm using a 3rd party library [tda-api](https://github.com/alexgolec/tda-api) to interact with the TDAmeritrade API. While running tests, we never want to call the API. It should be mocked with every interaction. Let's run through a typical evolution of our mock code.

### Iteration Number 1: Import Side effects

Here is what a naive implementation may look like. Our `price.py` is responsible for authenticating a TD client and then uses that client to get the price for a ticker. We've put our client at the top of the file to reuse for every subsequent function call. This is required to be a good API citizen and reduce the runtime of our code!

```python
# price.py
import tda
client = tda.auth.client_from_token_file(token_path, api_key)

def get_price(ticker, date):
  return client.get_price('AAPL')
```

```python
# test_price.py
import mock
from fixtures import MockTdClient

mock.patch('price.client', mock.MockTdClient)
def test_get_price():
  import price
  naive_implementation.get_price('AAPL')
```

### Iteration Number 2: The Singleton Solution

So what's wrong with the above implementation? As a general rule of thumb, <mark>importing a module should have zero side-effects</mark>.  Since we can't import this module without also authenticating with TDAmeritrade, we are forced to shove our `import` method into the test function so that we can properly mock our client. Ouch!

The natural evolution of the code would then be to build a singleton. In this pattern, we avoid import side effects by waiting to connect until a function is called. Our tests get better too as we are able to move our import out of the test function.

```python
# price.py
import tda
CLIENT = None

def _get_client():
  global CLIENT
  if CLIENT:
    return CLIENT
  else:
    CLIENT = tda.auth.client_from_token_file(token_path, api_key)
  	return CLIENT
  
def get_price(ticker, date):
  return CLIENT.get_price('AAPL')
```

```python
# test_price.py
import mock
import price
from fixtures import MockTdClient

mock.patch('price._get_client', mock.MockTdClient)
def test_get_price():
  price.get_price('AAPL')
```

### Iteration Number 2.5: Copy/Paste syndrome

This is <mark>usually where progress stops towards building better tests</mark>. As the application grows, you find yourself writing a lot of similar tests, all testing different logic, and scenarios, but with the same need to mock our client. You quickly find yourself copy/pasting different bits of code because it's near impossible to get the incantation of mocks & setup functions right for a new test function. Each new test adds code smell. Every new feature adds technical debt and lowers future velocity. The code below is a great example of what it looks like to be in this iteration...

```python
# test_price.py
import mock
import price
from fixtures import MockTdClient

mock.patch('price._get_client', mock.MockTdClient)
def test_get_price_a():
    ...

mock.patch('price._get_client', mock.MockTdClient)
def test_get_price_b():
    ...
mock.patch('price._get_client', mock.MockTdClient)
def test_get_price_c():
    ...
```

### Iteration Number 3: Write once, mock once, inject everywhere.

Before we can make our tests better, we need to improve the code. We'll need to implement a lightweight class to hide implementation details. This will provide a clear path for our end user, pytest in this case, to authenticate. We then take a "fake" token.json and write it to disc, yield a valid client, and finally, remove the token so we don't accidentally commit a build artifact.

```python{numberLines: true}
# client.py
"""Provides access to td ameritade client."""
import os
import tda


class TdClient(tda.client.synchronous.Client):
    """
    Provides a td ameritrade client for the user.

    Uses locally stored td_token.json to authenticate and provide a client. If one does not exist,
    instructs user to authenticate through tdameritrade and persists a json file for future use
    """

    _instance = None

    def __new__(cls):
        """Provides a nice singleton wrapper for the client."""
        if cls._instance is None:
            cls._instance = cls._get_client()
        return cls._instance

    @classmethod
    def _get_client(cls) -> tda.client.synchronous.Client:
        api_key = os.environ["TD_API_KEY"]
        token_path = "td_token.json"
        redirect_url = "http://127.0.0.1:8000"
        try:
            client = tda.auth.client_from_token_file(token_path, api_key, asyncio=False)
        except FileNotFoundError:
            client = tda.auth.client_from_manual_flow(api_key, redirect_url, token_path)

        return client
```
In line 30 of client.py we attempt to authenticate from a token file that is locally cached. This is an authentication mechanism within the tda-api library. Notice how our client is unaware of a testing environment. `if settings == TEST` conditions in application code is yet anohter really bad code smell that should be avoided. 
```python{numberLines: true}
# conftest.py
@pytest.fixture()
def td_client(mocker, token_data):
    token_path = "./td_token.json"
    with open(token_path, "w") as w:
        w.write(token_data)

    yield client.TdClient()

    os.remove(token_path)
```
Our fixture, `td_client` yields a TdClient on line 9, but not before writing a faked out token.json file. This enables our client to authenticate via file, rather than triggering a manual OAuth2.0 flow! After the client is done, a small clean up routine is completed on line 10.
```python{numberLines: true}
# test_price.py
import price


def test_get_price_a(td_client):
    price.get_price(...)

def test_get_price_b(td_client):
    price.get_price(...)
    
def test_get_price_c(td_client):
    price.get_price(...)
```

And here is our final product, our test_price.py file. Implementation details are tucked away and what's left is the important bit, what you are trying to test!

If your engineering team is living in iteration 2.5 for too long, it can create an existential risk to your business. If the business dictates adding Fidelity as a new client, a task that should take one week with little risk involved turns into a risky 3-month re-write of all your client code. If you're an engineering leader, it's your job to determine the appropriate time to stay within iteration 2.5.

If you're interested in knowing how this client "connection" happens without having our test suite actually make any HTTP calls and get valid data responses, please [tell me](https://electricocean.io/contact/). Spoiler alert, it's a combo of [vcrpy](https://vcrpy.readthedocs.io/en/latest/usage.html) and pytest.

# Testing the Format of your Code

Tools like [pre-commit](https://pre-commit.com) and [black](https://black.readthedocs.io/en/stable/index.html) are great tools that help you write consistently styled code; unfortunately, they aren't enough. You need consistency outside of your own development environment. The moment you add developer number 2, you'll constantly overwrite each other's commits, creating 3,000 line PRs when all you did was update a couple lines of code. 

Luckily, we already have a mechanism for rejecting PRs, sight unseen...failing tests. By adding linting checks to your tests, you align all contributors to a single vision of "style" with little overhead. It's worth spending 30 minutes to understand how to get your local linting environment aligned with a given project's test linting. If it's a new project, build in linting to your testing process on day one. If you need any additional motivation I recommend reading through the strong case for [optimizing feedback loops](/blog/sharpening-our-tools/) early in the development process. I'll briefly touch on how I've integrated a few key linting tools with pytest, but I encourage you to find what works best for you.

Most of the configuration for tests can be found in the [tox.ini](https://github.com/lucasnad27/quality-momentum/blob/c75e9735bc1a0f49f73d34fc4ed35a469d28d938/tox.ini) file. This is not the only way to configure your tests. I don't have any opinions on clear winners, but many solutions are available. We will accomplish secondary testing requirements by using pytest plugins. This is another clear advantage of using pytest. You can find a corresponding plugin for most popular libraries.

```shell{numberLines: true}
[pytest]
env_files=.env.test
addopts =
 --flake8
 --vcr-record=none

 # code coverage
 --cov=./src/quality_momentum
 --cov-branch
 --no-cov-on-fail
 --cov-report term

[flake8]
exclude=tests/**
ignore=D401,W503
max-complexity=15
max-line-length=120
per-file-ignores= __init__.py:F401
```

In the `pytest` section of our tox.ini file, we add the flake8 option to `addopts` (line 5). This is equivalent to running `pytest --flake8`. For this to work, we have to install the `pytest-flake8` extension. Every project is different, so be sure to set appropriate options for your linter. These options are handled in the flake8 section of the file. For the purpose of this limited series, I've only included a handful of configuration options.  If you inspect the pre-commit config, you'll notice I have additional code quality dependencies: black & mypy. Ideally, these should be included in your pytest runs as well. Linting a codebase early in its life cycle is potent preventative medicine, and an ounce of prevention is worth a pound of cure.

# Wrapping Up

This episode covered a lot of ground. We've covered why dependency injection is a good thing, patterns for mocking non-trivial APIs and enforcing code quality through tests. Above all, I hope that you, my dear reader, have a few more arrows in your quiver: explaining the importance of tests to a new member of the team, a stressed-out project manager on a deadline, and above all, why it leads to better products in a shorter period of time.
