<!DOCTYPE html>
<html lang="en">
  <head>
	  <meta charset="utf-8">
	  <title>Clay Count API</title>
	  <link rel="stylesheet" target="_blank" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	  <link rel="stylesheet" target="_blank" href="style.css">
  </head>
  <body>
  	<div class="container">
			<div class="col-xs-10">

				<section id="overview">
					<h1>Clay Count API</h1>
					<h3>Overview</h3>
					<p>The folder structure for the api is as follows: above everything there is the api folder. Below this, there is get or set folders. Inside these folders are the classes that make up the database. In these folders are the actual functions. These functions are outlined in detail below.</p>
					<p>All responses are returned in JSON format.</p>
				</section>

				<section id="events">
					<h2>Events (Tournaments)</h2>

					<h3>Add Event</h3>
					<p><a target="_blank" href="/api/set/event/add_event.php">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/event/add_event.php?id=ID&amp;name=NAME&amp;start_date=YYYY-MM-DD&amp;end_date=YYYY-MM-DD&amp;info=DESCRIPTION&amp;gauge_list=GAUGELIST&amp;stations=NUM&amp;max_mulligans=NUM&amp;admin_first_name=NAME&amp;admin_last_name=NAME&amp;admin_email=EMAIL&amp;admin_phone=XXX-XXX-XXXX</a></p>
					<h4>Returns</h4>
					<p>String: event_id of created event. Save this locally on the phone.</p>
					<p>Checks if an event with the passed key already exists. If event doesn't exist, it creates it.</p>

					<h3>Get Event (event_id)</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?event_id=EVENT_ID">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?event_id=EVENT_ID</a></p>
					<h4>Returns</h4>
					<p>Array of length 1 with all rows of event.</p>

					<h3>Get Event (event_name)</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?event_name=EVENT_NAME">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?event_name=EVENT_NAME</a></p>
					<h4>Returns</h4>
					<p>Array of events with matching name. Each elements contaions rows of a single event.</p>

					<h3>Get Event (admin_email)</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?admin_email=EMAIL">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?admin_email=EMAIL</a></p>
					<h4>Returns</h4>
					<p>Array of events with matching admin email.</p>

					<h3>Get Event (scorer_email)</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?scorer_email=EMAIL">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/event/get_event.php?scorer_email=EMAIL</a></p>
					<h4>Returns</h4>
					<p>Array of events with matching scorer email.</p>
				</section>

				<section id="teams">
					<h2>Teams</h2>

					<h3>Add Team</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/team/add_team.php">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/team/add_team.php?team_name=TEAM&amp;event_id=EVENT_ID</a></p>
					<p>Checks if team with the passed name already exists. If team doesn't exist, it creates it.</p>

					<h3>Get Team</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/team/get_team.php?team_name=NAME">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/team/get_team.php?team_name=NAME</a></p>
					<h4>Returns</h4>
					<p>Returns event_id associated with team names.</p>

					<h3>Get All Teams</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/team/get_team.php?event_id=EVENT_ID">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/team/get_team.php?event_id=EVENT_ID</a></p>
					<h4>Returns</h4>
					<p>Returns array of all team names in an event.</p>

					<h3>Get Team Members</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?team=TEAM">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?team=TEAM</a></p>
					<h4>Returns</h4>
					<p>Array of persons belonging to the passed team.</p>

					<h3>Get Team Scores</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/team/get_team_scores.php?event_id=EVENT">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/team/get_team_scores.php?event_id=EVENT</a></p>
					<h4>Returns</h4>
					<p>Array of teams with combined score descending order.</p>

				</section>

				<section id="persons">
					<h2>Persons</h2>

					<h3>Add Person</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/person/add_person.php">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/person/add_person.php?event_id=EVENT&amp;team_name=TEAM&amp;first_name=NAME&amp;last_name=NAME&amp;email=EMAIL&amp;phone=XXX-XXX-XXXX&amp;gauge=GAUGE_NAME&amp;mulligans=NUM</a></p>
					<p>Checks if an event with the passed key already exists. If event doesn't exist, it creates it.</p>

					<h3>Get Person (email)</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?email=EMAIL">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?email=EMAIL</a></p>
					<h4>Returns</h4>
					<p>Array of length 1 with matching Person.</p> 

					<h3>Get Person (team)</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?team=TEAM">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?team=TEAM</a></p>
					<h4>Returns</h4>
					<p>Array of Persons belonging to a certain team name.</p> 

					<h3>Get Person (first_name, last_name)</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?first_name=NAME&last_name=NAME">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/person/get_person.php?first_name=NAME&amp;last_name=NAME</a></p>
					<h4>Returns</h4>
					<p>Array of Persons with matching first and last name.</p> 
				</section>

				<section id="stations">
					<h2>Stations</h2>

					<h3>Add Station</h3>
					<p><a target="_blank" href="http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/station/add_station.php?event_id=blah&person_email=email1&station_num=1&num_hits=9">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/station/add_station.php?event_id=KEY&amp;person_email=EMAIL&amp;station_num=NUM&amp;num_hits=NUM</a></p>
					<h4>Returns</h4>
					<p>True or false for insert.</p>
					<p>Checks if an station with the passed info already exists. If station doesn't exist, it creates it.</p>

					<h3>Get Station</h3>
					<p><a target="_blank" href="/api/get/station/get_station.php?event_id=KEY&person_email=EMAIL&station_num=NUM">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/station/get_station.php?event_id=KEY&amp;person_email=EMAIL&amp;station_num=NUM</a></p>
					<h4>Returns</h4>
					<p>Array of length 1 with all rows of station.</p>
				</section>

				<section id="scorer">
					<h2>Scorers</h2>

					<h3>Add Scorer</h3>
					<p><a target="_blank" href="/api/set/scorer/add_scorer.php?event_id=blah&first_name=chris&last_name=belcher&email=email3&phone=555-555-5555&station_num=2">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/set/station/add_station.php?event_id=KEY&amp;first_name=NAME&amp;last_name=NAME&amp;person_email=EMAIL&amp;station_num=NUM</a></p>
					<h4>Returns</h4>
					<p>True or false for insert.</p>
					<p>Checks if an scorer with the passed info already exists. If scorer doesn't exist, it creates it.</p>

					<h3>Get Scorer(event_id/email)</h3>
					<p><a target="_blank" href="/api/get/scorer/get_station.php?event_id=KEY&email=EMAIL">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/scorer/get_station.php?event_id=KEY&mp;email=EMAIL</a></p>
					<h4>Returns</h4>
					<p>Unique scorer based on event and email.</p>

					<h3>Get Scorer(event_id)</h3>
					<p><a target="_blank" href="/api/get/scorer/get_station.php?event_id=KEY">http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/get/scorer/get_station.php?event_id=KEY</a></p>
					<h4>Returns</h4>
					<p>All registered scorers of an event.</p>
				</section>

			</div>
			<div class="quick-select-menu">
				<div class="menu-inner">
					<h3>Menu</h3>
					<ul class="section-list">
						<li><a target="_blank" href="#overview">overview</a></li>
						<li><a target="_blank" href="#events">events</a></li>
						<li><a target="_blank" href="#teams">teams</a></li>
						<li><a target="_blank" href="#persons">persons</a></li>
					</ul>
				</div>
			</div>
		</div>
  </body>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
  <script src="main.js"></script>
</html>