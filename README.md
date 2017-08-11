# GithubGraphs
This is website where you can put url of GitHub repository, and it will parse the PRs and you can see what is wrong.<br/>
<b>How to run:</b><br/>
go to https://github.com/settings/tokens and create/select your token<br/>
<br/>
go to project GithubGraphs/Internship_project and write:<br/>
pip install -r requirements.txt<br/>
python manage.py migrate
<br/>
<br/>
For start server:<br/>
TOKEN=[*YOUR_TOKEN*] python3 manage.py runserver --insecure<br/>
<br/>
For update data:<br/>
TOKEN=[*YOUR_TOKEN*] python manage.py update - will update all websites <br/>
TOKEN=[*YOUR_TOKEN*] python manage.py update [*user*]/[*repo*] - update only one repo
<br/><br/>
For download data from repo:
<br/>
TOKEN=[*YOUR_TOKEN*] python3 manage.py save_website [*user*]/[*repo*]<br/><br/>
if it doesn't work check your python version.