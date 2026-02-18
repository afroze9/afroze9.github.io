---
title: "A Simple Batch Reporting Tool That Saved Hours of Manual Work"
date: 2025-12-16
description: "How a straightforward automation script transformed a tedious healthcare reporting process"
tags: [healthcare, automation, python]
---


## The Background

Back in 2015, I was working on a Medical Health Record product for healthcare providers in the US. Cloud services were still in their infancy, old systems were still deployed to on-prem servers, or sometimes on servers in datacenters / server farms. This product was one of those. It ran on Windows Server machines; the code was written in fun languages like VB6, and newer components used C#/.NET along with self-hosted SQL Server Instances (along with the mandatory bunch of dozen or so windows services who no one knew what they did).

Since the app was used throughout the US, instead of having a centralized deployment, they utilized server farms across multiple states to serve users in their regions.
As a side-effect of this, there wasn't a central database of users, there wasn't a centralized Auth system. Each server kept its own list of users and each instance was accessible via its own subdomain. And each instance of the App/DB combo hosted around 40-50 tenants.

Because of this decentralized architecture, there were a number of issues:
- If you were a support representative, and you had to help someone on call with their account, you would need a login for each tenant on each server (think 100s of logins) and maintain them somewhere (usually insecure ways like text files in notepad or sticky notes)
- The account managers sometimes needed to run reports that weren't accessible via the UI. Requesting a new report was a long laborious process that would take months to pass through the backlog, get implemented and finally deployed. For urget reports, some L3 reps were allowed to request access to and run custom SQL queries directly on the tenants' databases!!!
- You could have multiple users with the same username in different regions (not relevant here but it causes issues later)

Keen eyed folks must have realized by now how terrible that is from a security perspective. The higher ups at one point figured it out too.

So what they ended up doing was, to create a central application, that had access to connect to the auth systems on each of the server instances.
You logged into that app and it would show you a list of all the tenants that you had access to, and would let you magically log into any of them without the need to remember/enter a bunch of credentials. (Problem # 1 solved).

Then someone else had the idea that, why not use the same app/portal to run ad-hoc reports on each tenant.
The idea was that since these ad-hoc reports didn't need to be perfect, the portal team would have a shorter turn-around time in publishing reports and making them available.
The users would then select a tenant, select a report, add some parameters, and download a spreadsheet containing the extracted data. (Problem # 2 Solved)


## The Fun Part

This is where my part of the story begins. I was hired as an account manager into this company. I was assigned around 10 customers the second week and my role was to listen to their concerns any time the called, sent an email, logged a ticket etc. I had to figure out their concerns, pass them on to the accounts receivable / billing teams and generally follow up on their issues.

To do all of this, specifically the Accounts Receivable stuff, I had to run a lot of customized SQL reports, format them so they looked all nice and shiny, and email them out to the clients.

Considering 10 customers, I had to:
- Run 3 different reports per customer daily
- Run 2 different reports per customer weekly
- Run 5 different reports per customer monthly

In short I was spending half my day just repititively generating reports.
There had to be a better way to do this.

I was newly getting into .NET at that time for some hobby projects.