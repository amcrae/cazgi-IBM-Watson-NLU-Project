# IBM/Coursera "Developing Cloud Apps with Node.js and React"
## Week 5 Final Project

Author: Andrew McRae.

### Status
Code finished, doing deployment.

1. Watson service created, but the screenshots are not in the repo. None of documentation tells you what to do with these screenshots until you have done everything and get to step 5 which the the peer review submission. I almost made the mistake of adding the screenshots to the repository, but I looked ahead to step 6 "Peer graded assignment" and it has a form with two file upload slots for the screenshots.
2. Part A finished.
3. Part B finished.
4. Part C finished.
5. Text test cases set up.
6. Text input analysis functions working.
7. URL test cases set up.
8. URL input analysis functions are working.
9. Server-side is passing 6 out of 6 tests.
10. API functions connected to HTTP request handlers.
11. Outputs rendered in React client.

Now attempting the Publish steps.

### Watson API Notes
Please note that I created all the Watson services in the Sydney region since that's nearest to where I live. The examples during the labs all said to use Dallas. As the services should be identical in all regions I do not know of any reason why this would not work.

### Note on using github from cognitiveclass.ai cloud development environment.
GitHub were trying to disable the use of passwords for git and move everybody to SSH keys only. IBM's course instructions still specify to clone and push via HTTPS. 
I tested a git push via HTTPS from Theia, and after being asked for the github account password, it worked. So this works at the moment.

Some extra steps (found via StackOverflow of course) which make this online development easier are:
>  `git config credential.helper store`  
>  `git config --global credential.helper 'cache --timeout 7200'`  

Which means I don't get prompted for the password more than once every 2 hours.

