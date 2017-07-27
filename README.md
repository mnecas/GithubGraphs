# GithubGraphs
This is website where you can put url of GitHub repository, and it will parse the PRs and you can see what is wrong.<br/>
<b>How to run:</b>
>in terminal write git clone https://github.com/ocasek/GithubGraphs.git <br/>
go to https://github.com/settings/tokens and create/select your token<br/>
replace in views.py "TOKEN_HERE" with your token<br/>
then in termilan go to GithubGraphs/Internship_project write:<br/>
pip install -r requirements.txt<br/>
python manage.py runserver<br/>
if it doesn't work check your python version.

<b>Work with graphs</b><br>
> First thing what you need to do is submit github user and repo from which you want the data.<br/>
It can take a lot of time because github api give me only 100 PRs per request<br/>

![alt text](img.png)
python manage.py update - will update all websites <br/>
python manage.py update [*user*]/[*repo*] - update only one repo<br/> 
That how look the graphs
