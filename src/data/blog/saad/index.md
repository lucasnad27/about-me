---
category: 'blog'
cover: './aws-python-trading.png'
title: 'Making Technical Decisions'
description: 'S3 as a Database (SAAD)'
date: '2021-11-10'
tags: ['database', 'decisionmaking']
published: true
---

In this episode of our Trading Bot series, we'll learn how to make better decisions as professionals. I will take you through an informative use case; assessing the nuanced, often-debated decision of application data storage. I hope to provide you with some new tools to help you get past the ill-fated "it depends" answer, ultimately leading to better products and user experience.

# Quality Questions beget Quality Answers

AWS or GCP? Kubertnetes or ECS? Postgres or MySQL? We've all been asked some variation of these questions throughout our careers. Unfortunately, these questions do not produce answers, only more questions. They lack that magical ingredient..._context_. Without context, our only answer is, "it depends". Just ask developer advocate [cassidoo](https://www.youtube.com/watch?v=aMWh2uLO9OM). Depends on what you might ask? That is where it's important to go on a fact-finding mission to obtain context. A few examples of quality questions...

*Organizational Context*
- Does our organization already have expertise with one set of technologies?

*Problem Space Context*
- What are current best practices in the industry?
- Does this technology choice meaningfully impact the value proposition of our company? Our purpose?

*Product Context*
- Who is our user and how will they interact with our product?
- How many users? 10,000? 10,000,000?
- Are there any unique usage patterns the product expects? Does your product need to scale, but only during rush hour? Or are you streaming video content around the world 24/7?

*Time Context*
- Is this a proof-of-concept or a library with a 20 year lifespan?
- How does the business expect to grow over the next 1/5/10 years?

<mark>These questions all aim to achieve clarity through context. Your decision will only be as good as the questions you ask.</mark> When choosing a data store for my trading bot, it was important to get it right, as it plays a key requirement for completing our algorithm. So, what's the right answer? We won't know until we ask the right questions...

- _How much data do we need to store?_
- _Will our data storage needs change in the future?_
- _How important is cost as a consideration?_
- _What is an acceptable "response time" for our users?_
- _Do we expect a lot of users to be using this system all at once?_

With an extra 5 minutes you should be able to create another 10 questions. As you gain experience, these questions come quicker and with greater efficacy; allowing you to consistently make quality decisions.

# Use Case: Data Storage & Retrieval mechanisms

Most applications need to store state somewhere. But how & where? The obvious answer would be to choose a relational database. If you've built an application before, you've probably already started mapping out what the schema would look like. But is this the right decision? Most of the time, yes! Nonetheless, let's run through the exercise of asking questions to gain context.

- _**How much data do we need to store?**_ EOD prices for US stocks for the last 30 years with the ability to easily add new countries or regions.
- _**Will our data storage needs change in the future?**_ If we decide to run a new strategy that requires a shorter time window (say 1 minute interval) or an options strategy, our data will grow exponentially.
- _**How important is cost as a consideration?**_ I'm running this is a single user. The closest approximation of "revenue" for this project is made up of two components
    1. The amount of money we are saving by removing management fees.
    2. The potential for increased Alpha (AKA "an edge"), outperforming their ETF-equivalents.

A few other questions I asked of myself include:
- _What is an acceptable "response time" for our users?_
- _What does the distribution of traffic look like? What's our expected throughput?_
- _Whats your disaster recovery plan look like?_

Now that we have at least one principle to guide our more practical questions, let's make a decision on what database to use. AWS S3.
![](./lebowski.gif)

# S3 as a Database (SAAD)

No super-flexible ElasticSearch clusters to be found. No always-on Postgres instance. And definitely not some hard drive sitting in my basement. Why S3? They optimize for cheap and available (like...[REALLY available](https://aws.amazon.com/blogs/storage/architecting-for-high-availability-on-amazon-s3/)) data storage and retrieval. S3 isn't perfect.

## Benefits
- Super cheap storage. $0.023 per GB. Yes, that's 2.5 pennies per GB! Although it shouldn't matter for our use case, egress data charges are a real thing. Cloudflare R2 is [challenging this pricing model](https://www.lastweekinaws.com/blog/the-compelling-economics-of-cloudflare-r2/). Plan accordingly.
- "Infinite" storage is possible.
- AWS ecosystem advantage. It's akin to picking an in-network specialist from your health care plan. It makes everything easier.

## Drawbacks
- Lacks Strong Consistency - although in December 2020, AWS S3 [Strong Consistency](https://aws.amazon.com/s3/consistency/)
- Lacks an expressive language for querying the data. In other words, it doesn't provide a SQL-92 implementation.
- Lacks other SQL concepts allowing for better data query performance and integrity - indices, foreign keys, constraints, triggers.

The benefits of s3 align with our cost-optimization principle. The drawbacks either don't matter, like a read-only node being out-of-sync for a few millisecond; or will be abstracted through code, like our inability to expressively query data.

# Conclusion

I've managed to write an entire article about **why** we chose SAAD without actually showing you how to implement something similar. I think [the code](https://github.com/lucasnad27/quality-momentum/blob/573e5b34f986ffd1303252cd2f4bcdfb5fff7df0/src/quality_momentum/equities/historical.py#L24) speaks for itself. If you are interested in learning more about the how and why of any design decisions, [reach out](https://electricocean.io/contact/)! I respond directly to all messages.

I hope this episode reaffirms your current decision-making methodology, or provided a few tips on how to refine it! We've covered some "squishy" topics like
- Guiding decisions through first-principle thinking
- Types of questions you should be asking yourself and your team
- Picking a technology and building coding abstractions that highlight their strengths and minimize their weaknesses

