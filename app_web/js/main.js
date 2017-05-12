/*
Explanation of how app will handle offline data:

Data we MUST have before scorer goes offline:
	Event config
	Scorer stations
	Teams
	Shooters

The scorer must login to the app online to pull all relevant data about event,
before event starts and after info is finalized.

Admin must finalize shooters and teams and event settings before going offline to update other phones.

Grab relevant info and store into local storage.
Update everytime there is an internet connection using ajax.
Check to make sure we aren't overwritting relevant info with NULL info.

*/

// base url to api
var url = "http://claycount.com.php56-17.ord1-1.websitetestlink.com/api/";

// save the current user that is logged in
var local_user = getLocalVar("user");

// get all previously saved event info
var local_event_list = getLocalVar( "all_event_info" );

// if local event list is null, create empty array to push to.
if( !local_event_list )
	local_event_list = [];

// global variables to keep track of scoped info between pages
var cur_event;
var cur_team;
var cur_person;
var cur_station;
var cur_scorer;
var spectatorEventId = "";
var ajax_flag;

// function queue to hold update calls when no internet
var functionQueue = getLocalVar( "functionQueue" );
if( !functionQueue )
	functionQueue = [];

$(document).ready(function(){
	// on page load

	// check if user is already logged in
	if( local_user ) {
		// update content sections
		updateAllSections();
		navToSection("#myEvents");
		if( local_user.isAdmin )
			navUpdate("admin");
		else
			navUpdate("scorer");
	}
	else {
		local_user = {};
		$("#welcomeScreen").fadeIn(400);
	}

	// enable event handlers on load
	enableEventHandlers();

	// form submissions
	formSubmitHandler();

});

// when a form is submitted, call the corresponding function with proper data
function formSubmitHandler(){
	// on submit, call custom handler for form.
	$("form").submit(function(e){
		// prevent default action
		e.preventDefault();

		// set hidden values
		if( local_user.user_info )
			$("[type=hidden][name=admin_email]").val(local_user.user_info.email);
		if( cur_event )
			$("[type=hidden][name=event_id]").val(cur_event.id);

		// switch on id
		switch( this.id ) {
			case "adminLogin_loginForm":
				adminLogin( this );
				break;
			case "scorerLogin_loginForm":
				scorerLogin( this );
				break;
			case "adminRegister_register":
				// admin trying to login. Update event info and go to my events.
				validateAdminRegister( this );
				break;
			case "createEvent_eventInfo":
				// send event to db for creation
				createEvent( this );
				break;
			case "editEvent_eventInfo":
				// send event to db for creation
				editEvent( this );
				break;
			case "createTeam_teamForm":
				// send event to db for creation
				createTeam( this );
				break;
			case "editTeam_teamForm":
				// send event to db for creation
				editTeam( this );
				break;
			case "createShooter_shooterForm":
				// send event to db for creation
				createShooter( this );
				break;
			case "editShooter_shooterForm":
				// send event to db for creation
				editShooter( this );
				break;
			case "createScorer_scorerForm":
				// send event to db for creation
				createScorer( this );
				break;
			case "adminEdit_update":
				// add to function queue
				var obj = {};
				obj.funcName = "updateAdmin";
				obj.data = this;
				functionQueue.push( obj );
				// try to save everything in the queue.
				emptyFunctionQ();
				break;
			case "scorerEdit_update":
				editScorer( this );
				break;
			case "teamsHome_teamList_CSV":
				// send event to db for creation
				importTeams( this );
				break;
			case "eventSelect_eventID":
				// send event to db for creation
				spectatorEventId = $( this ).find("input[name='event_id']").val();
				updateEventLeaderboard( spectatorEventId );
				break;
		}
	});
}

function updateEventLeaderboard( event_id ){
	toast("Loading...");
	// ajax call to get scores by shooters
	$.ajax({
		url: url + "get/person/get_final_scores_ordered.php?shooters=true&event_id=" + event_id,
		success: function( result ){
			// what to do with result from api call
			result = JSON.parse( result );
			populateShooterLeaderboard( result );
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
	// ajax call to get scores by teams
	$.ajax({
		url: url + "get/person/get_final_scores_ordered.php?teams=true&event_id=" + event_id,
		success: function( result ){
			// what to do with result from api call
			result = JSON.parse( result );
			populateTeamLeaderboard( result );
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
	setTimeout( function(){
		navToSection("#eventViewScores");
	}, 1000 );
}

function populateShooterLeaderboard( shooters ){
	var html = "";
	for( var i = 0; i < shooters.length; i++ ){
		html += '<hr>';
		html += '<div class="col-sm-6">';
		html += '<h3>'+ shooters[i].first_name + ' ' + shooters[i].last_name +'</h3>';
		html += '<h4>'+ shooters[i].team_name +'</h4>';
		html += '<p><strong>Score: </strong>'+ shooters[i].final_tally +'</p>';
		html += '<p><strong>Gauge: </strong>'+ shooters[i].gauge +'</p>';
		html += '</div>';
	}
	$("#eventViewScores_shooterScores").html( html );
}

function populateTeamLeaderboard( teams ){
	var html = "";
	for( var i = 0; i < teams.length; i++ ){
		html += '<hr>';
		html += '<div class="col-sm-6">';
		html += '<h3>'+ teams[i].team_name +'</h3>';
		html += '<p><strong>Score: </strong>'+ teams[i].team_tally +'</p>';
		html += '</div>';
	}
	$("#eventViewScores_teamScores").html( html );
}

// grab all event info that correlates with the admin email passed
function adminLogin( form ){
	toast("Loading...");
	// admin trying to login. Update event info and go to my events.
	var admin_email = $( form ).find("[name=email]").val();
	var admin_pass = $( form ).find("[name=password]").val();
	// encrypt pass
	safe_pass = hashString( admin_pass );
	var isAdmin = true;
	// nested callbacks for all the ajax thats about to unfold on your ass.
	// hold onto your pants, its going to get hairy.
	authenticateUser( admin_email, safe_pass, isAdmin, function(){
		updateUserInfo( admin_email, isAdmin, function(){
			updateEventsInfo( admin_email, isAdmin, function(){
				updateTeamsInfo( function(){
					updateShootersInfo( function(){
						updateScores( function(){
							navToSection("#myEvents");
							updateAllSections();
							setLocalVar( "all_event_info", local_event_list );
						}); // end update scores
					}); // end update shooters info
				}); // end update teams info
			}); // end update event info
		}); // end update user
	}); // end user authenticated
}

// grab all events and info they contain pertaining to this shooter
function scorerLogin( form ){
	toast("Loading...");
	var scorer_email = $( form ).find("[name=email]").val();
	var scorer_pass = $( form ).find("[name=password]").val();
	// encrypt pass
	safe_pass = hashString( scorer_pass );
	var isAdmin = false;
	authenticateUser( scorer_email, safe_pass, isAdmin, function(){
		updateUserInfo( scorer_email, isAdmin, function(){
			updateEventsInfo( scorer_email, isAdmin, function(){
				getScorerStations( function(){
					navToSection("#myEvents");
					updateAllSections();
					navUpdate("scorer");
					setLocalVar( "all_event_info", local_event_list );
				});
			});
		}); // end update user

	} );
}

function getScorerStations( callback ){
	// only is called on scorer and userinfo is complete
	$.ajax({
		url: url + "get/station/get_station.php?scorer_email=" + local_user.user_info.email,
		success: function( result ){
			// will return a list of stations that the scorer has access to.
			// get unique list of events, get event info for these, then add the stations to it
			result = JSON.parse( result );
			for( var i = 0; i < result.length; i++ ){
				var row = result[i];
				// get event and station objects
				var this_event = getLocalEvent( row.event_id );
				var this_station = getStation( this_event.stations, row.station_num );
				// build new shooter for station
				var new_shooter = {};
				new_shooter.first_name = row.first_name;
				new_shooter.last_name = row.last_name;
				new_shooter.person_email = row.person_email;
				new_shooter.team_name = row.team_name;
				new_shooter.phone = row.phone;
				new_shooter.gauge = row.gauge;
				new_shooter.num_hits = row.num_hits;
				new_shooter.mulligans = row.mulligans;
				// check if we need to update current station or push new one.
				if( this_station ){
					// we have a station. Get the shooter we are trying to update
					var this_shooter = getShooter( this_station.shooters, new_shooter.person_email );
					// update or push current shooter
					if( this_shooter )
						this_shooter = new_shooter;
					else
						this_station.shooters.push( new_shooter );
				}
				else{
					// build new station
					var new_station = {};
					new_station.station_num = row.station_num;
					new_station.total_hits = row.total_hits;
					new_station.shooters = [];
					// push shooter to station
					new_station.shooters.push( new_shooter );
					// push station to event
					this_event.stations.push( new_station );
				}
			}

			callback();

	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

function authenticateUser( email, password, isAdmin, callback ){
	// authenticate user before allowing login.
	ajax_url = url;
	if( isAdmin )
		ajax_url += "get/admin/auth_admin.php?email=" + email + "&password=" + password;
	else
		ajax_url += "get/scorer/auth_scorer.php?email=" + email + "&password=" + password;

	$.ajax({
		url: ajax_url,
		success: function( result ){
			// what to do with result from api call
			if( JSON.parse( result ) ){
				if( isAdmin )
					navUpdate("admin");
				else
					navUpdate("scorer");
				callback();
			}
			else
				alert("Invalid password/email combination.");
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

// update the user info form the database
function updateUserInfo( email, isAdmin, callback ) {
	ajax_url = url;
	if( isAdmin )
		ajax_url += "get/admin/get_admin.php?email="+email;
	else
		ajax_url += "get/scorer/get_scorer.php?email="+email;
	// update user info then call to update event info.
	$.ajax({
		url: ajax_url,
		success: function( result ){
			// what to do with result from api call
			local_user.isAdmin = isAdmin;
			if( isAdmin ){
				local_user.user_info = JSON.parse( result )[0];
				populateUpdateUser( true );
			}
			else{
				local_user.user_info = formatScorerInfo( JSON.parse( result ) );
				populateUpdateUser( false );
			}

			setLocalVar("user", local_user);
			callback();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

// update all info we can that the provided email is authorized to access
function updateEventsInfo( email, isAdmin, callback ){
	// build api url
	// base url to correct call
	var ajax_url = url + "get/event/get_event.php?";
	// if is admin email, pass admin param. Else, scorer param
	if( isAdmin )
		ajax_url += "admin_email";
	else
		ajax_url += "scorer_email";
	// add the passed email to the call
	ajax_url += "=" + email;

	// ajax call to get all events that the email has access to.
	$.ajax({
		url: ajax_url,
		success: function( result ){
			// result contains array of events
			result = JSON.parse( result );
			// for each event, update the event in global event list.
			if( result ){
				// user is authenticated, save in local storage
				setLocalVar("user", local_user);
				// dump old data to fill with new stuff from database
				local_event_list = [];
				// we have some results. Update the info.
				for( var i = 0; i < result.length; i++ ) {
					// update the event
					updateEvent( result[i] );
				}

				// if we are admin, update stations and scorers
				if( local_user.isAdmin ){
					// check that for responses before moving on because we have 2 ajax calls
					var ajax_responses = 0;

					// ajax call to get scorers
					updateStations( function(){
						// check if other ajax response is back yet
						if( ajax_responses )
							callback(); // if it did, call the callback
						else
							ajax_responses++; // if it didn't flip the flag so the other will call the callback
					} );

					// ajax call to get scorers
					updateEventScorers( function(){
						// check if other ajax response is back yet
						if( ajax_responses )
							callback(); // if it did, call the callback
						else
							ajax_responses++; // if it didn't flip the flag so the other will call the callback
					} );
				}
				else {
					callback();
				}
			}
			else {
				if( local_user.isAdmin ){
					updateMyEventsSection();
					navToSection("#myEvents");
				}
				else
					alert("This email does not correspond to any events. Contact your admin to add you to an event.");
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}


// pull stations info
function updateStations( callback ){
	$.ajax({
		url: url + "get/event/get_stations.php?admin_email=" + local_user.user_info.email,
		success: function( result ){
			result = JSON.parse( result );
			clearStations();
			// add the returned rows to the event stations
			for( var j = 0; j < result.length; j++ ){
				var station = result[j];
				var this_event = getLocalEvent( station.event_id );
				var this_station = getStation( this_event.stations, station.station_num );
				if( this_station )
					this_station = station;
				else
					this_event.stations.push( station );
			}
			callback();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update station info at this time." );
	  	}
	  }
	});
}

function updateEventScorers( callback ){
	$.ajax({
		url: url + "get/scorer/get_scorer.php?admin_email=" + local_user.user_info.email,
		success: function( result ){
			result = JSON.parse( result );
			clearScorers();
			for( var i = 0; i < result.length; i++ ){
				var row = result[i];
				var this_event = getLocalEvent( row.event_id );
				var this_scorer = getScorer( this_event, row.email );
				if( this_scorer )
					this_scorer = row;
				else
					this_event.scorers.push(row);
			}
			// call callback
			callback();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

function updateTeamsInfo( foundTeams, noTeams ){
	// get all persons from database.
	var ajax_url = url + "get/team/get_all_teams.php?admin_email=";
	ajax_url += local_user.user_info.email;

	$.ajax({
		url: ajax_url,
		success: function( result ){
			// result should be an array of teams
			result = JSON.parse( result );
			if( result ){
				// clear old team data and start fresh with result
				clearTeams();
				for( var i = 0; i < result.length; i++ ) {
					var team = Team( result[i] );
					// see if team exists already
					var event = getLocalEvent( team.event_id );
					var match_team = getTeam( event, team.name );
					// if they exist, update. Otherwise, push to team.
					if( match_team )
						match_team = team;
					else{
						event.teams.push( team );
					}
				}
				setLocalVar( "all_event_info", local_event_list );
				// all people pushed to teams.
				if( foundTeams )
					foundTeams();
			}
			else {
				// no teams exist yet.
				if( noTeams )
					noTeams();
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

function updateShootersInfo( callback ){
	// get all persons from database.
	var ajax_url = url + "get/person/get_all_persons.php?admin_email=";
	ajax_url += local_user.user_info.email;

	$.ajax({
		url: ajax_url,
		success: function( result ){
			// result should be an array of persons
			result = JSON.parse( result );
			clearShooters();
			if( result ){
				for( var i = 0; i < result.length; i++ ) {
					var person = Person( result[i] );
					// see if team exists already
					var event = getLocalEvent( person.event_id );
					var team = getTeam( event, person.team_name );
					// see if the person exists on this team
					var match_person = getPerson( event, person.email );
					// if they exist, update. Otherwise, push to team.
					if( match_person )
						match_person = person;
					else {
						// cast person
						person = Person( person );
						team.persons.push( person );
					}
				}
			}
			else {
				// no shooters exist yet.
				toast("No shooters found.");
			}
			setLocalVar( "all_event_info", local_event_list );
			// all people pushed to teams.
			callback();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

function updateScores( callback ){
	$.ajax({
		url: url + "get/person/get_scores.php?admin_email=" + local_user.user_info.email,
		success: function( result ){
			result = JSON.parse( result );
			for( var i = 0; i < result.length; i++ ){
				var row = result[i];
				var this_event = getLocalEvent( row.event_id );
				var this_person = getPerson( this_event, row.person_email );
				if( this_person ){
					var this_station = getStation( this_person.stations, row.station_num );
					if( this_station )
						this_station = row;
					else
						this_person.stations.push( row );
				}
				else
					console.log("Phantom scores associated with shooter: " + row.person_email);
			}
			callback();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

function validateAdminRegister( form ){
	// validate fields on front end
	if( $(form).find("[name=password]").val() == $(form).find("[name=password_confirm]").val() ){
		// validated form

		// encrypt password
		var unsafePass = $(form).find("[name=password]").val();
		var encryptPass = hashString( unsafePass );
		$(form).find("[name=password]").val( encryptPass );

		$.ajax({
			url: url + "set/admin/add_admin.php?" + $( form ).serialize(),
			success: function( result ){

				result = JSON.parse( result );
				if( result === true ){
					// pull updates from server.
					var admin_email = $("#adminRegister_register").find("[name=email]").val();
					updateUserInfo( admin_email, true, function(){
						// everything is good.
						updateMyEventsSection();
						toast("Account created.");
						navUpdate("admin");
						navToSection("#myEvents");
					} );
				}
				else {
					alert( result );
				}
		  },
		  // error function can stay same for all calls.
		  error: function( jqXHR, textStatus, errorThrown ){
		  	// if status is not zero, we have an error we didn't expect
		  	if( jqXHR.status ) {
		  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
		  	}
		  	// if status is zero, no internet
		  	else {
		  		alert( "No internet connection, cannot update event info at this time." );
		  	}
		  }
		});
	}
}

function updateAdmin( form, success, error ){
	if( $( form ).find("[name='password']").val() != $( form ).find("[name='password_confirm']").val() ){
		alert( "Passwords don't match." );
		return 1;
	}
	
	data = getValidInputs( form );
	// generic ajax call format.
	$.ajax({
		url: url + "set/admin/update_admin.php?" + data,
		success: function( result ){
			// what to do with result from api call
			if( JSON.parse( result ) )
				success();
			else
				error();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
			error();
	  }
	});
}

function createEvent( form ){

	// submit event to server
	$.ajax({
		url: url + "set/event/add_event.php?" + $( form ).serialize(),
		success: function( result ){
			// result should contain id of event.
			var result = JSON.parse( result );

			if( hasProp( result, "id" ) ){
				// if we were able to submit the event, then we have a connection
				// instead of updating the local event list with local info,
				// get updates from server.
				updateEventsInfo( local_user.user_info.email, local_user.isAdmin, function(){
					updateMyEventsSection();
					navToSection("#myEvents");
				});
			}
			else {
				alert( result );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

function editEvent( form ){
	toast("Loading...");
	// only pull inputs with value
	data = getValidInputs( form );
	$.ajax({
		url: url + "set/event/update_event.php?" + data,
		success: function( result ){
			// result should contain id of event.
			var result = JSON.parse( result );

			if( hasProp( result, "id" ) ){
				// if we were able to submit the event, then we have a connection
				// instead of updating the local event list with local info,
				// get updates from server.
				updateEventsInfo( local_user.user_info.email, local_user.isAdmin, function(){
					updateTeamsInfo( function(){
						updateShootersInfo( function(){
							updateScores( function(){
								navToSection("#teamDetails");
								updateAllSections();
								setLocalVar( "all_event_info", local_event_list );
							}); // end update scores
						}); // end update shooters info
					}); // end update teams info
				});
			}
			else {
				alert( result );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

function deleteEvent(){
	if( confirm("Are you sure you wish to delete this event? This will remove all teams, shooters, and scores associated with this event. \nThis cannot be undone.") ){
		// delete event
		$.ajax({
			url: url + "set/event/delete_event.php?id=" + cur_event.id,
			success: function( result ){
				// result should contain id of event.
				var result = JSON.parse( result );
				if( result ){
					toast("Loading...");
					// if we were able to submit the event, then we have a connection
					// instead of updating the local event list with local info,
					// get updates from server.
					updateEventsInfo( local_user.user_info.email, local_user.isAdmin, function(){
						updateTeamsInfo( function(){
							updateShootersInfo( function(){
								updateScores( function(){
									toast("Event deleted.");
									updateAllSections();
									setLocalVar( "all_event_info", local_event_list );
									navToSection("#myEvents");
								}); // end update scores
							}); // end update shooters info
						}); // end update teams info
					});
				}
				else{
					toast("Problem deleting event.");
					navToSection("#myEvents");
				}
		  },
		  // error function can stay same for all calls.
		  error: function( jqXHR, textStatus, errorThrown ){
		  	// if status is not zero, we have an error we didn't expect
		  	if( jqXHR.status ) {
		  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
		  	}
		  	// if status is zero, no internet
		  	else {
		  		alert( "No internet connection, cannot delete team at this time." );
		  	}
		  }
		});
	}
	else{
		toast("Canceled");
		navToSection("#myEvents");
	}
}

function createTeam( form ){
	// submit team to server
	$.ajax({
		url: url + "set/team/add_team.php?" + $( form ).serialize(),
		success: function( result ){
			result = JSON.parse( result );
			if( result === true ){
				// if we were able to submit the team, then we have a connection
				// instead of updating the local event list with local info,
				// get updates from server.
				updateTeamsInfo( function(){
					updateShootersInfo( function(){
						updateScores( function(){
							setLocalVar( "all_event_info", local_event_list );
							updateTeamList( cur_event.teams );
							navToSection( "#teamsHome" );
						}); // end update scores
					}); // end update shooters info
				},
				function(){
					// no teams found
					alert("Problem adding team.");
				});
			}
			else {
				alert( "Cannot add team. \nCheck that a team by that name does not already exist." );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update team info at this time." );
	  	}
	  }
	});
}

function editTeam( form ){
	toast("Loading...");
	// submit team to server
	data = getValidInputs( form );
	$.ajax({
		url: url + "set/team/update_team.php?" + data,
		success: function( result ){
			result = JSON.parse( result );
			if( result === true ){
				// if we were able to submit the team, then we have a connection
				// instead of updating the local event list with local info,
				// get updates from server.
				updateTeamsInfo( function(){
					updateShootersInfo( function(){
						updateScores( function(){
							updateAllSections();
							setLocalVar( "all_event_info", local_event_list );
							navToSection("#teamsHome");
						}); // end update scores
					}); // end update shooters info
				},
				function(){
					// no teams found
					alert("Problem updating team.");
				});
			}
			else {
				alert( "Cannot add team. \nCheck that a team by that name does not already exist." );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update team info at this time." );
	  	}
	  }
	});
}

function deleteTeam(){
	if( confirm("Are you sure you wish to delete this team? This will remove all shooters and scores associated with this team. \nThis cannot be undone.") ){
		// delete team
		$.ajax({
			url: url + "set/team/delete_team.php?event_id=" + cur_event.id + "&name=" + cur_team.name,
			success: function( result ){
				// result should contain id of event.
				var result = JSON.parse( result );
				if( result ){
					toast("Loading...");
					// if we were able to submit the event, then we have a connection
					// instead of updating the local event list with local info,
					// get updates from server.
					updateTeamsInfo( function(){
						updateShootersInfo( function(){
							updateScores( function(){
								toast("Team deleted.");
								navToSection("#eventHome");
								updateAllSections();
								setLocalVar( "all_event_info", local_event_list );
							}); // end update scores
						}); // end update shooters info
					}); // end update teams info
				}
				else{
					toast("Problem deleting team.");
					navToSection("#eventHome");
				}
		  },
		  // error function can stay same for all calls.
		  error: function( jqXHR, textStatus, errorThrown ){
		  	// if status is not zero, we have an error we didn't expect
		  	if( jqXHR.status ) {
		  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
		  	}
		  	// if status is zero, no internet
		  	else {
		  		alert( "No internet connection, cannot delete team at this time." );
		  	}
		  }
		});
	}
	else{
		toast("Canceled");
		navToSection("#teamsHome");
	}
}

function importTeams( form ){
	// form has csv of shooter info
	var file = $(form).find("[name='teamCSV']")[0].files[0];
	if (file) {
	    var reader = new FileReader();
	    reader.readAsText(file, "UTF-8");
	    reader.onload = function (evt) {
	        var contents =  evt.target.result;
	        var lines = contents.split("\n");
	        var shooterInfo = [];
	        // first line is headers and last line is blank
	        for( var i = 1; i < lines.length-1; i++ ){
	        	var info = lines[i].split(",");
	        	var shooter = {};
	        	shooter.team_name = info[0];
	        	shooter.last_name = info[1];
	        	shooter.first_name = info[2];
	        	shooter.email = info[3];
	        	shooter.phone = info[4];
	        	shooter.gauge = info[5];
	        	shooter.mulligans = info[6];
	        	shooterInfo.push( shooter );
	        }
	        importShooterList( shooterInfo );
	    }
	    reader.onerror = function (evt) {
	        alert("Error reading file.");
	    }
	}

}

function importShooterList( shooters ){
	toast("Adding teams.");
	// shooters is an array of shooters.
	// create teams that do not exist
	var teams = [];
	for( var i = 0; i < shooters.length; i++ ){
		teams.push( shooters[i].team_name );
	}
	teams = $.unique( teams );
	var teamCount = teams.length;

	// make sure all teams are in database already by adding them all and ignoring "already exists" errors
	for( var i = 0; i < teams.length; i++ ){
		$.ajax({
			url: url + "set/team/add_team.php?event_id=" + cur_event.id + "&name=" + teams[i],
			complete: function( result ){
				// regardless of result, decrement team counter and wait for all calls to return.
				teamCount--;
				if( teamCount == 0 ){
					bulkAddShooters( shooters );
				}
		  }
		});
	}
}

function bulkAddShooters( shooters ){
	toast("Adding shooters.");
	var shooterCount = shooters.length;
	// add shooters to their teams
	for( var i = 0; i < shooters.length; i++ ){
		var ajax_url = url + "set/person/add_person.php?event_id=" + cur_event.id + "&team_name=" + shooters[i].team_name + "&first_name=" + shooters[i].first_name + "&last_name=" + shooters[i].last_name + "&email=" + shooters[i].email + "&phone=" + shooters[i].phone + "&gauge=" + shooters[i].gauge + "&mulligans=" + shooters[i].mulligans;
		$.ajax({
			url: ajax_url,
			complete: function( result ){
				// regardless of result, decrement team counter and wait for all calls to return.
				shooterCount--;
				if( shooterCount == 0 ){
					// update shooters info
					updateTeamsInfo( function(){
						updateShootersInfo( function(){
							updateScores( function(){
								updateTeamList( cur_event.teams ); 
								setLocalVar( "all_event_info", local_event_list );
								navToSection( "#teamsHome" );
							});
						});
					});
				}
		  }
		});
	}
}

function createShooter( form ){
	$(form).find("#createShooter_shooterForm_eventID").val(cur_event.id);
	$(form).find("#createShooter_shooterForm_team_name").val(cur_team.name);
	// submit team to server
	$.ajax({
		url: url + "set/person/add_person.php?" + $( form ).serialize(),
		success: function( result ){
			result = JSON.parse( result );
			if( result === true ){
				// if we were able to submit the team, then we have a connection
				// instead of updating the local event list with local info,
				// get updates from server.
				updateShootersInfo( function(){
					updateScores( function(){
						setLocalVar( "all_event_info", local_event_list );
						updateTeamList( cur_event.teams );
						updatePersonList( cur_team );
						navToSection( "#teamDetails" );
					});
				},
				function(){
					// no teams found
					alert("Problem adding Person.");
				});
			}
			else {
				alert( "Cannot add shooter. \nCheck that a person by that name does not already exist." );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update team info at this time." );
	  	}
	  }
	});
}

function editShooter( form ){
	toast("Loading...");
	data = getValidInputs( form );
	$.ajax({
		url: url + "set/person/update_person.php?email=" + cur_person.email + "&" + data,
		success: function( result ){
			result = JSON.parse( result );
			if( result === true ){
				// if we were able to submit the team, then we have a connection
				// instead of updating the local event list with local info,
				// get updates from server.
				updateShootersInfo( function(){
					updateScores( function(){
						setLocalVar( "all_event_info", local_event_list );
						updateTeamList( cur_event.teams );
						updatePersonList( cur_team );
						navToSection( "#teamDetails" );
					});
				},
				function(){
					// no teams found
					alert("Problem updating Person.");
				});
			}
			else {
				alert( "Cannot add shooter. \nCheck that a person by that name does not already exist." );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update team info at this time." );
	  	}
	  }
	});
}

function ajaxUpdateMulligans(data, success, failure){
	// TODO
	var shooter_email = data.email;
	var team_name = data.team_name;
	var shooter_mulligans = data.mulligans;
	var event_id = data.event_id;

	$.ajax({
		url: url + "set/person/update_person.php?event_id=" + event_id + "&old_team_name=" + team_name + "&email=" + shooter_email + "&mulligans="+ shooter_mulligans,
		success: function( result ){
			// what to do with result from api call
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}


function deleteShooter(){
	if( confirm("Are you sure you wish to delete this shooter? This will remove all scores associated with this shooter. \nThis cannot be undone.") ){
		// delete shooter
		$.ajax({
			url: url + "set/person/delete_person.php?event_id=" + cur_event.id + "&team_name=" + cur_team.name + "&email=" + cur_person.email,
			success: function( result ){
				// result should contain id of event.
				var result = JSON.parse( result );
				if( result ){
					toast("Loading...");
					// if we were able to submit the event, then we have a connection
					// instead of updating the local event list with local info,
					// get updates from server.
					updateShootersInfo( function(){
						updateScores( function(){
							toast("Shooter deleted.");
							navToSection("#teamsHome");
							updateAllSections();
							setLocalVar( "all_event_info", local_event_list );
						}); // end update scores
					}); // end update shooters info
				}
				else{
					toast("Problem deleting shooter.");
					navToSection("#teamsHome");
				}
		  },
		  // error function can stay same for all calls.
		  error: function( jqXHR, textStatus, errorThrown ){
		  	// if status is not zero, we have an error we didn't expect
		  	if( jqXHR.status ) {
		  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
		  	}
		  	// if status is zero, no internet
		  	else {
		  		alert( "No internet connection, cannot delete shooter at this time." );
		  	}
		  }
		});
	}
	else{
		toast("Canceled");
		navToSection("#teamDetails");
	}
}

function createScorer( form ){
	$(form).find("#createScorer_scorerForm_eventID").val(cur_event.id);
	var data = getValidInputs( form );
	// submit team to server
	$.ajax({
		url: url + "set/scorer/add_scorer.php?" + data,
		success: function( result ){
			result = JSON.parse( result );
			if( result === true ){
				// we added the scorer.
				updateEventScorers( function(){
					updateScorerList();
					setLocalVar( "all_event_info", local_event_list );
					navToSection( "#scorerList" );
				}); // end update scores
			}
			else {
				alert( "Cannot add scorer. \nCheck that a scorer by that email does not already exist." );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update team info at this time." );
	  	}
	  }
	});
}

function editScorer( form ){
	toast("Loading...");
	// submit team to server
	var data = getValidInputs( form );
	$.ajax({
		url: url + "set/scorer/update_scorer.php?" + data,
		success: function( result ){
			result = JSON.parse( result );
			if( result === true ){
				// we added the scorer.
				updateUserInfo( local_user.user_info.email, local_user.isAdmin, function(){
					setLocalVar( "all_event_info", local_event_list );
					navToSection( "#myEvents" );
				}); // end update scores
			}
			else {
				alert( "Problem updating scorer." );
			}
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update team info at this time." );
	  	}
	  }
	});
}

function deleteScorer(){
	if( confirm("Are you sure you wish to delete this scorer? \nThis cannot be undone.") ){
		// delete shooter
		$.ajax({
			url: url + "set/scorer/delete_scorer.php?event_id=" + cur_event.id + "&email=" + cur_scorer.email,
			success: function( result ){
				// result should contain id of event.
				var result = JSON.parse( result );
				if( result ){
					toast("Loading...");
					// if we were able to submit the event, then we have a connection
					// instead of updating the local event list with local info,
					// get updates from server.
					updateEventsInfo( local_user.user_info.email, local_user.isAdmin , function(){
						// update cur event
						cur_event = getLocalEvent( cur_event.id );
						toast("Scorer deleted.");
						navToSection("#eventHome");
						updateScorerList();
						setLocalVar( "all_event_info", local_event_list );
					}); // end update shooters info
				}
				else{
					toast("Problem deleting scorer.");
					navToSection("#eventHome");
				}
		  },
		  // error function can stay same for all calls.
		  error: function( jqXHR, textStatus, errorThrown ){
		  	// if status is not zero, we have an error we didn't expect
		  	if( jqXHR.status ) {
		  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
		  	}
		  	// if status is zero, no internet
		  	else {
		  		alert( "No internet connection, cannot delete scorer at this time." );
		  	}
		  }
		});
	}
	else{
		toast("Canceled");
		navToSection("#eventHome");
	}
}

function ajaxUpdateScore( data, success, error ){
	// call to update a persons score in the database.
	/*
	Keys:
		event_id
		person_email
		station_num
	Updates:
		num_hits
	*/
	$.ajax({
		url: url + "set/station/update_station.php?event_id=" + data.event_id + "&person_email=" + data.person_email + "&station_num=" + data.station_num + "&num_hits=" + data.num_hits,
		success: function( result ){
			if( JSON.parse( result ) )
				success();
			else
				error();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  	error();
	  }
	});
}

// load in all the content we have.
function updateAllSections(){

	// Assume all of our needed info is stored in our local storage.
	// Update all the sections with this content.
	// add loading animation for all these parts.

	// showLoading();s
	updateMyEventsSection();
	populateUpdateUser( local_user.isAdmin );
	// hideLoading();

	// update navigation and send user to events page.
	if( local_user.isAdmin )
		navUpdate("admin");
	else
		navUpdate("scorer");
	// navToSection( "#myEvents" );
}

// update the my events tab
function updateMyEventsSection(){
	// check there are events
	if( local_event_list.length ){
		// create html string for events section
		var html = "";
		for( var i = 0; i < local_event_list.length; i++ ) {
			html += '<div class="col-sm-6" data-nav="#eventHome" data-event_id="' + local_event_list[i].id + '">';
			html += '<div class="nav-holder">';
			html += '<h3 class="event-name">' + local_event_list[i].name + '</h3>';
			html += '<p class="event-date">' + local_event_list[i].start_date + '</p>';
			html += '<p class="event-location">' + local_event_list[i].location + '</p>';
			html += '</div>';
			html += '</div>';
		}

		// add the html to the section and navigate to it
		$("#myEvents_eventList").html(html);
		// reenable nav for new section
		enableEventHandlers();
	}
	else {
		html = '<div class="col-sm-6"><p>No Events Found</p></div>';
		$("#myEvents_eventList").html(html);
	}
}

// update the event home tab
function updateEventHomeSection( this_event ){
	cur_event = this_event;
	// create html string for events section
	var html = "";
  html += '<div class="col-sm-6"><h3>' + this_event.name + '</h3></div>';
  html += '<div class="col-sm-6"><p><strong>Event ID: </strong>' + this_event.id + '</p></div>';
  html += '<div class="col-sm-6"><p><strong>Start Date: </strong>' + this_event.start_date + '</p></div>';
  html += '<div class="col-sm-6"><p><strong>End Date: </strong>' + this_event.end_date + '</p></div>';
  html += '<div class="col-sm-6"><p><strong>Location: </strong>' + this_event.location + '</p></div>';
  html += '<div class="col-sm-6"><p><strong>Gauges: </strong>' + this_event.gauge_list + '</p></div>';
  html += '<div class="col-sm-6"><p><strong>Stations: </strong>' + this_event.num_stations + '</p></div>';
  html += '<div class="col-sm-6"><p><strong>Max Mulligans: </strong>' + this_event.max_mulligans + '</p></div>';

	// add the html to the section and navigate to it
	$("#eventHome_eventContainer").html(html);
	if( local_user.isAdmin ){
		updateTeamList( this_event.teams );
		populateEditEvent();
	}
	else
		updateScorerStationList();
	$("#createEvent_eventInfo_stationDetails").html("");
}


function populateUpdateUser( isAdmin ){
	var form;
	if( isAdmin )
		form = $("#adminEdit_update");
	else
		form = $("#scorerEdit_update");
	form.find("[name='first_name']").val( local_user.user_info.first_name );
	form.find("[name='last_name']").val( local_user.user_info.last_name );
	form.find("[name='email']").val( local_user.user_info.email );
	form.find("[name='phone']").val( local_user.user_info.phone );
}

function populateEditEvent(){
	var form = $("#editEvent");
	form.find("[name='name']").val( cur_event.name );
	form.find("[name='start_date']").val( cur_event.start_date );
	form.find("[name='end_date']").val( cur_event.end_date );
	form.find("[name='location']").val( cur_event.location );
	form.find("[name='gauge_list']").val( cur_event.gauge_list );
	form.find("[name='max_mulligans']").val( cur_event.max_mulligans );
	form.find("[name='event_id']").val( cur_event.id );
}

function populateEditTeam(){
	var form = $("#editTeam_teamForm");
	form.find("[name='old_name']").val( cur_team.name );
	form.find("[name='event_id']").val( cur_event.id );	
}

function populateEditShooter(){
	var form = $("#editShooter_shooterForm");
	form.find("[name='first_name']").val( cur_person.first_name );
	form.find("[name='last_name']").val( cur_person.last_name );
	form.find("[name='email']").val( cur_person.email );
	form.find("[name='phone']").val( cur_person.phone );
	form.find("[name='gauge']").val( cur_person.gauge );
	form.find("[name='mulligans']").val( cur_person.mulligans );
	form.find("[name='old_team_name']").val( cur_person.team_name );
	form.find("[name='event_id']").val( cur_event.id );

	var newTeams = "";
	var teams = cur_event.teams;
	for( var i = 0; i < teams.length; i++ ){
		if( teams[i].name == cur_person.team_name )
			newTeams += '<option value="' + teams[i].name + '" selected>' + teams[i].name + '</option>';
		else
			newTeams += '<option value="' + teams[i].name + '">' + teams[i].name + '</option>';
	}

	form.find("[name='new_team_name']").html( newTeams );
}

function updateScorerStationList(){
	var html = "";
	var stations = cur_event.stations;
	for( var i = 0; i < stations.length; i++ ){
		// this should only be 1 in theory as 1 scorer to 1 stations, but unclear
		// make sure you can handle more than 1 station assigned to a scorer
		html += '<div class="col-sm-6" data-nav="#scorerEntry" data-station_num="' + stations[i].station_num + '">';
		html += '<div class="nav-holder">';
		html += "<h3>Station " + stations[i].station_num + "</h3>";
		html += "<p><strong>Total Hits: </strong>" + stations[i].total_hits + "</p>";
		html += '</div>';
		html += "</div>";
	}
	$("#scorerStations_stationList").html(html);
	enableEventHandlers();
}

// update team list content
function updateTeamList( teams ){
	// if there are no teams listed, just leave "No teams" content that is initialized in index.html
	if( teams.length ){
		var html = "";
		for( var i = 0; i < teams.length; i++ ) {
		  html += '<div class="col-sm-6" data-nav="#teamHome" data-team="' + teams[i].name + '">';
		  html += '<div class="nav-holder">';
		  html += '<h3>' + teams[i].name + '</h3>';
		  html += '<p><strong>Members: </strong>' + teams[i].persons.length + '</p>';
		  html += '</div>';
		  html += '</div>';
		}
		// add the html to the section and navigate to it
		$("#teamsHome_teamList").html(html);
		// reenable nav for new section
		enableEventHandlers();
	}
	else {
		html = '<div class="col-sm-6"><p>No Teams Found</p></div>';
		$("#teamsHome_teamList").html(html);
	}
}

// update person list content
function updatePersonList( team ) {
	cur_team = team;
	populateEditTeam();
	var persons = team.persons;
	// if there are no shooters listed, just leave "No shooters" content that is initialized in index.html
	if( persons.length ){
		var html = "";
		for( var i = 0; i < persons.length; i++ ) {
		  html += '<div class="col-sm-6" data-nav="#shooterHome" data-shooter="' + persons[i].email + '">';
		  html += '<div class="nav-holder">';
		  html += '<p><strong>' + persons[i].first_name + " " + persons[i].last_name + '</strong></p>';
		  html += '</div>';
		  html += '</div>';
		}
		// add the html to the section and navigate to it
		$("#teamDetails_shooterList").html(html);
		// reenable nav for new section
		enableEventHandlers();
	}
	else {
		html = '<div class="col-sm-6"><p>No People Found</p></div>';
		$("#teamDetails_shooterList").html(html);
	}
}

// update person detail contents
function updatePersonDetails( person ){
	cur_person = person;
	populateEditShooter();
	var html = "";
	html += '<div class="col-sm-12"><h3>' + person.first_name + ' ' + person.last_name + '</h3></div>';
	html += '<div class="col-sm-12"><h4>'+ person.team_name +'</h4></div>';
	html += '<div class="col-sm-6"><p><strong>Gauge: </strong>'+ person.gauge +'</p></div>';
	html += '<div class="col-sm-6"><p><strong>Email: </strong>'+ person.email +'</p></div>';
	html += '<div class="col-sm-6"><p><strong>Phone: </strong>'+ person.phone +'</p></div>';
	html += '<div class="col-sm-6"><p><strong>Mulligans: </strong>'+ person.mulligans +'</p></div>';
	html += '<div class="col-sm-6"><p><strong>Score: </strong>' + printTotalScore( person.stations ) + '</p></div>';
	// add the html to the section and navigate to it
	$("#shooterHome_shooterDetails").html(html);

	// update the score tab
	html = "";
	for( var i = 0; i < person.stations.length; i++ ){
		var score = person.stations[i];
		html += '<div class="col-sm-6">'
		html += '<h3>Station ' + score.station_num + '</h3>';
		html += '<p><strong>Score:</strong> ' + score.num_hits + '/' + score.total_hits +'</p>';
		html += '</div>';
	}
	$("#shooterScore_stationList").html(html);
}

// update the amount of stations in the "create stations" section in event creation
function updateCreateStations(){
	str = "";
	var stations = Number($("#createEvent_eventInfo_numStations").val());
	for( var i = 0; i < stations; i++ ){
		var num = i + 1;
		str += '<div class="col-sm-6">';
		str += '<div class="form-group">';
		str += '<h3>Station ' + num + '</h3>';
    str += '<label for="num_stations">Number of Shots:</label>';
    str += '<input class="station-details form-control" min="1" max="50" value="8" type="number" name="num_hits[]" data-stationNum="' + num + '" required>';
		str += '</div>';
		str += '</div>';
	}
	$("#createEvent_eventInfo_stationDetails").html(str);
	$("#createEvent_eventInfo input[type=submit]").removeAttr("disabled");
}


function updateScorerStationsSelect(){
	str = "";
	var stations = cur_event.stations.length;
	for( var i = 0; i < stations; i++ ){
		var num = i + 1;
		str += '<div class="checkbox-group"><p><input type="checkbox" name="station_nums[]" value="'+ (i + 1) +'"> Station ' + (i + 1) + '</p></div>';
	}
	$("#createScorer_scorerForm_stations").html(str);
}

// populate scorer list
function updateScorerList(){
	var html = "";
	for( var i = 0; i < cur_event.scorers.length; i++ ){
		var scorer = cur_event.scorers[i];
		html += '<div data-nav="#scorerDetails" data-scoreremail="' + scorer.email + '" class="col-sm-6">';
		html += '<div class="nav-holder">';
		html += '<h3>' + scorer.first_name + ' ' + scorer.last_name + '</h3>';
		html += '<p><strong>Email: </strong>' + scorer.email + '</p>';
		html += '<p><strong>Phone: </strong>' + scorer.phone + '</p>';
		html += '</div>';
		html += '</div>';
	}
	$("#scorerList_scorers").html(html);
	enableEventHandlers();
}

function updateScorerDetails( scorer ){
	cur_scorer = scorer;
	var html = "";
	html += '<div class="col-sm-12"><h3>' + scorer.first_name + ' ' + scorer.last_name + '</h3></div>';
	html += '<div class="col-sm-6"><p><strong>Email: </strong>'+ scorer.email +'</p></div>';
	html += '<div class="col-sm-6"><p><strong>Phone: </strong>'+ scorer.phone +'</p></div>';
	html += '<div class="col-sm-6"><p><strong>Station: </strong>'+ scorer.station_num +'</p></div>';
	// add the html to the section
	$("#scorerDetails_details").html(html);
}

// populate scorer list
function updateShooterSelect(){
	var html = '<div class="col-sm-6">';
	html += '<h3>Select a shooter</h3>';
	html += '<select id="scorerEntry_stationList_curShooter">';
	html += '<option disabled selected>-- Select Shooter --</option>';
	var shooters = cur_station.shooters;
	for( var i = 0; i < shooters.length; i++ ){
		html += '<option value="' + shooters[i].person_email + '">' + shooters[i].first_name + ' ' + shooters[i].last_name + ' (' + shooters[i].person_email + ')</option>';
	}
	html += '</select>';
	html += '</div>';
	$("#stationInfo").html("Total Clays: " + cur_station.total_hits + "<br>Max Mulligans: " + cur_event.max_mulligans );
	$("#scorerEntry_stationList").html(html);
	enableEventHandlers();
}

function updateShooterScore(){
	var shooter = $("#scorerEntry_stationList_curShooter").val();
	shooter = getShooter( cur_station.shooters, shooter );
	cur_person = shooter;
	$("#scorerEntry_scoreEntry").show();
	$("#scorerEntry_scoreEntry input").attr("max", cur_station.total_hits);
	$("#scorerEntry_scoreEntry input").val(cur_person.num_hits);
}

// given an event, either update the local event or push it to the local event array.
function updateEvent( event ) {
	// instantiate new event from passed results
	event = Event( event );
	var localEvent = getLocalEvent( event.id );
	if( localEvent ) {
		// we have a local event. Remove it then push new event.
		removeLocalEvent( event.id );
	}
	local_event_list.push( event );
	// update local storage with local_event_list
	setLocalVar( "all_event_info", local_event_list );
}

// given an id, get the event with corresponding id in global var. Otherwise, return false.
function getLocalEvent( id ) {
	if( local_event_list ) {
		for( var i = 0; i < local_event_list.length; i++ ) {
			if( local_event_list[i].id == id )
				return local_event_list[i];
		}
		return false;
	}
	else {
		return false;
	}
}

function removeLocalEvent( id ){
	if( local_event_list ) {
		for( var i = 0; i < local_event_list.length; i++ ) {
			if( local_event_list[i].id == id )
				local_event_list.splice(i, 1);
		}
		return false;
	}
	else {
		return false;
	}
}

function clearShooters(){
	for( var i = 0; i < local_event_list.length; i++){
		for( var j = 0; j < local_event_list[i].teams.length; j++ ){
			var team = local_event_list[i].teams[j];
			team.persons = [];
		}
	}
}

function clearTeams(){
	for( var i = 0; i < local_event_list.length; i++ ){
		local_event_list[0].teams = [];
	}
}

function clearScorers(){
	for( var i = 0; i < local_event_list.length; i++ ){
		local_event_list[0].scorers = [];
	}	
}

function clearStations(){
	for( var i = 0; i < local_event_list.length; i++){
		for( var j = 0; j < local_event_list[i].teams.length; j++ ){
			var team = local_event_list[i].teams[j];
			for( var k = 0; k < team.length; k++ ){
				team.persons[k].stations = []
			}
		}
	}
}

// get team given an event and team name
function getTeam( event, name ){
	// get teams
	var teams = event.teams;
	for( var i = 0; i < teams.length; i++ ) {
		// compare name and return team if match
		if( teams[i].name == name )
			return teams[i];
	}
	// no team found, return false
	return false;
}

// get a person from team
function getPerson( event, email ){
	// get teams
	var teams = event.teams;
	for( var i = 0; i < teams.length; i++ ) {
		// loop through persons list
		var persons = teams[i].persons;
		for( var j = 0; j < persons.length; j++ ){
			// compare emails and return person if match
			if( persons[j].email == email )
				return persons[j];
		}
	}
	// no person found, return false
	return false;

}

// get a person from team
function getStation( stations, station_num ){
	if( !stations ) {
		return false;
	}
	// get station
	for( var i = 0; i < stations.length; i++ ) {
		if( stations[i].station_num == station_num )
			return stations[i];
	}
	// no person found, return false
	return false;
}

function getShooter( shooters, shooter_email ){
	if( !shooters ) {
		return false;
	}
	// get station
	for( var i = 0; i < shooters.length; i++ ) {
		if( shooters[i].person_email == shooter_email )
			return shooters[i];
	}
	// no person found, return false
	return false;
}

// get a scorer from an event
function getScorer( event, email ){
	if( !email ) {
		return false;
	}
	// get scorer
	for( var j = 0; j < event.scorers.length; j++ ) {
		var found_email = event.scorers[j].email;
		if( found_email == email )
			return event.scorers[j];
	}
	// no scorer found, return false
	return false;
}

// print out sum of hits and total hits and send back the string
function printTotalScore( stations ){
	var hits = 0;
	var outOf = 0;
	for( var i = 0; i < stations.length; i++ ){
		hits += Number( stations[1].num_hits );
		outOf += Number( stations[1].total_hits );
	}
	return hits + "/" + outOf;
}

// enable navigation between sections.
function enableEventHandlers() {
	// enable movile nav menu
	$(".nav-button").unbind('click');
	$(".nav-button").click(function(){
		$(this).find(".fa").toggleClass("fa-bars").toggleClass("fa-times");
		$("#header_mainMenu").toggle(400);
	});

	// on nav button click, get data-nav and navigate to that section.
	$("[data-nav]").unbind('click');
	$("[data-nav]").click(function( e ){
		e.preventDefault();
		var navSection = $( this ).data( "nav" );
		if( !local_user.user_info )
			navUpdate("logout");
		else if( local_user.isAdmin )
			navUpdate("admin");
		else
			navUpdate("scorer");
		navToSection( navSection );
		// hide mobile nav
		$(".nav-button").find(".fa-times").toggleClass("fa-bars").toggleClass("fa-times");
		$("#header_mainMenu").hide(400);
	});

	// on event click, update event content
	$("[data-event_id]").unbind('click');
	$("[data-event_id]").click(function( e ){
		e.preventDefault();
		var event_id = $( this ).data( "event_id" );
		var this_event = getLocalEvent( event_id );
		updateEventHomeSection( this_event );
		if( local_user.isAdmin )
			navUpdate("admin");
		else
			navUpdate("scorer");
		navToSection( "#eventHome" );
	});

	// on teams click, update persons list content
	$("[data-team]").unbind('click');
	$("[data-team]").click(function( e ){
		e.preventDefault();
		var team_name = $( this ).data( "team" );
		var team = getTeam( cur_event, team_name );
		updatePersonList( team );
		if( local_user.isAdmin )
			navUpdate("admin");
		else
			navUpdate("scorer");
		navToSection("#teamDetails");
	});

	// on teams click, update persons list content
	$("[data-shooter]").unbind('click');
	$("[data-shooter]").click(function( e ){
		e.preventDefault();
		var shooter_email = $( this ).data( "shooter" );
		var person = getPerson( cur_event, shooter_email );
		updatePersonDetails( person );
		if( local_user.isAdmin )
			navUpdate("admin");
		else
			navUpdate("scorer");
		navToSection( "#shooterHome" );
	});

	// update create event dates on selections
	$("#createEvent_eventInfo input[name='start_date']").unbind('blur');
	$("#createEvent_eventInfo input[name='start_date']").blur(function(){
		// get value of this field and update the end date min.
		var date = $( this ).val();
		$("#createEvent_eventInfo input[name='end_date']").attr('min', date);
	});

	$("#createEvent_eventInfo input[name='end_date']").unbind('blur');
	$("#createEvent_eventInfo input[name='end_date']").blur(function(){
		// get value of this field and update the start date max.
		var date = $( this ).val();
		$("#createEvent_eventInfo input[name='start_date']").attr('max', date);
	});

	// on scorer list navigation, update scorer list
	$("[data-nav='#scorerList']").unbind('click');
	$("[data-nav='#scorerList']").click(function( e ){
		e.preventDefault();
		updateScorerList();
		updateScorerStationsSelect();
		if( local_user.isAdmin )
			navUpdate("admin");
		else
			navUpdate("scorer");
		navToSection( "#scorerList" );
	});

	// on scorer list details, update details
	$("[data-nav='#scorerDetails']").unbind('click');
	$("[data-nav='#scorerDetails']").click(function( e ){
		e.preventDefault();
		var scorer = getScorer( cur_event, $( this ).data('scoreremail') );
		updateScorerDetails( scorer );
		navToSection( "#scorerDetails" );
	});

	// on scorer list navigation, update scorer list
	$("[data-nav='#scorerEntry']").unbind('click');
	$("[data-nav='#scorerEntry']").click(function( e ){
		e.preventDefault();
		cur_station = getStation( cur_event.stations, $( this ).data("station_num") );
		updateShooterSelect();
		navToSection( "#scorerEntry" );
	});

	$("#createEvent_eventInfo_numStations").unbind('change');
	$("#createEvent_eventInfo_numStations").on('change', updateCreateStations);

	$("#scorerEntry_stationList_curShooter").unbind('change');
	$("#scorerEntry_stationList_curShooter").on('change', updateShooterScore);

	$("#scorerEntry_scoreEntry .hit_button").unbind('click');
	$("#scorerEntry_scoreEntry .hit_button").click(function(e){
		e.preventDefault();
		var score = Number( $("#scorerEntry_scoreEntry_shooterScore").val() );
		if( score < Number( $("#scorerEntry_scoreEntry_shooterScore").attr("max") ) )
			$("#scorerEntry_scoreEntry_shooterScore").val( score + 1);
	});

	$("#scorerEntry_scoreEntry .updateScore").unbind('click');
	$("#scorerEntry_scoreEntry .updateScore").click(function(e){
		e.preventDefault();
		// update local person score
		cur_person.num_hits = $("#scorerEntry_scoreEntry_shooterScore").val();
		// create data object for updating database
		var upstation = {};
		upstation.event_id = cur_event.id;
		upstation.person_email = cur_person.person_email;
		upstation.station_num = cur_station.station_num;
		upstation.num_hits = cur_person.num_hits;
		// add to function queue
		var obj = {};
		obj.funcName = "ajaxUpdateScore";
		obj.data = upstation;
		functionQueue.push( obj );
		// try to save everything in the queue.
		emptyFunctionQ();
	});

	$("#scorerEntry_scoreEntry .mulligan_button").unbind('click');
	$("#scorerEntry_scoreEntry .mulligan_button").click(function(e){
		e.preventDefault();
		// update local person score
		cur_person.mulligans = (parseInt( cur_person.mulligans ) - 1).toString();
		// TODO
		// create data object for updating database
		var upstation = {};
		shooter_data.event_id = cur_event.id;
		shooter_data.mulligans = cur_person.mulligans;
		shooter_data.email = cur_person.email;
		shooter_data.team_name = cur_person.team_name;
		// add to function queue
		var obj = {};
		obj.funcName = "ajaxUpdateMulligans";
		obj.data = shooter_data;
		functionQueue.push( obj );
		// try to save everything in the queue.
		emptyFunctionQ();
	});
}

// update nav items based on credentials
function navUpdate( update ) {
	// hide nav menu first
	$("#header_mainMenu").hide(400);
	setTimeout( function(){
		switch ( update ){
			case "logout":
				// hide all nav items except logout and help
				$(".hide_admin, .hide_scorer").show();
				$(".hide_login").hide();
				break;
			case "admin":
				// show nav items for admin
				$(".hide_login, .hide_scorer").show();
				$(".hide_admin").hide();
				break;
			case "scorer":
				// show nav items for scorer
				$(".hide_admin, .hide_login").show();
				$(".hide_scorer").hide();
				break;
			default:
				$(".hide_admin, .hide_scorer").show();
				$(".hide_login").hide();
		}
	}, 400);
}

function emptyFunctionQ(){
	toast("Connecting to server to save.");
	var keepArray = [];
	var failureFlag = 0;
	for( var i = 0; i < functionQueue.length; i++ ){
		// switch statement to call functions and pass data.
		// function queue structure will be function name and data object
		switch( functionQueue[i].funcName ){
			case 'ajaxUpdateScore':
				ajaxUpdateScore( functionQueue[i].data, function(){
					// update worked
				}, function(){
					// update failed. Add to keepArray to call again
					keepArray.push( functionQueue[i] );
				} )
				break;
			case 'updateAdmin':
				failureFlag += updateAdmin( functionQueue[i].data, function(){
					// update worked
					navToSection("#myEvents");
				}, function(){
					// update failed. Add to keepArray to call again
					keepArray.push( functionQueue[i] );
				} );
				break;
			case 'ajaxUpdateMulligans':
				failureFlag += ajaxUpdateMulligans( functionQueue[i].data, function(){
					// update worked
					toast("Mulligan Removed");
				}, function(){
					// update failed. Add to keepArray to call again
					keepArray.push( functionQueue[i] );
				} );
				break;
			default:
				keepArray.push( functionQueue[i] );
		}
	}

	functionQueue = keepArray;

	if( keepArray.length )
		toast("Not all updates were pushed to the server, edits saved locally.");
	else{
		if( !failureFlag )
			toast("All your updates were saved.");
		else
			toast("There was a problem.")
	}
}

// navigate to new section
function navToSection( section ){
	$("section").fadeOut(400);
	setTimeout(function(){
		$(section).fadeIn(400);
	}, 400);
}

// show message at bottom of page and fade out
function toast(text) {
	// shows text at bottom of screen for 3 seconds then fades out.
	$("#toaster").html(text).fadeIn(700);
	setTimeout( function(){ $("#toaster").fadeOut(700); } , 3000);
}

// parses local storage
function getLocalVar( key ) {
	if( !localStorage.getItem( key ) ) {
		return localStorage.getItem( key );
	}
	var object = localStorage.getItem( key );
	object = JSON.parse( object );
	return object;
}

// sets local storage
function setLocalVar( key, obj ) {
	var obj = JSON.stringify( obj );
	localStorage.setItem( key, obj );
	return obj;
}

// takes an array of rows from db of scorer rows.
// each row matches one scorer email
function formatScorerInfo( scorer_arr ){
	// differences between rows are event id and station num
	// these should be in another table, but whatever
	var scorer = {};
	// grab info from first element in array because all this stuff is the same
	scorer.email = scorer_arr[0].email;
	scorer.first_name = scorer_arr[0].first_name;
	scorer.last_name = scorer_arr[0].last_name;
	scorer.phone = scorer_arr[0].phone;
	// create arrays to hold event ids and stations
	scorer.event_station = [];
	// loop through and fill these arrays
	for( var i = 0; i < scorer_arr.length; i++ ){
		var obj = {};
		obj.event_id = scorer_arr[i].event_id;
		obj.station_num = scorer_arr[i].station_num;
		scorer.event_station.push( obj );
	}
	return scorer;
}

function logOut(){
	localStorage.clear();
	local_event_list = [];
	navUpdate("logout");
	navToSection('#welcomeScreen');
}

function getValidInputs( form ) {
	var inputs = $( form ).find("input");
	var data = "";
	for( var i = 0; i < inputs.length; i++ ){
		if( ($( inputs[i] ).val().length || inputs[i].disabled) && (inputs[i].type != "submit") ){
			var value = $(inputs[i]).val();
			var key = $(inputs[i]).attr("name");
			// hash passwords
			if( key == "password" )
				value = hashString(value);
			data += key + "=" + value + "&";
		}
	}
	data = data.substring(0, data.length-1);
	return data;
}

function hashString(str){
	// skip for testing purposes
	if( str == "pass" ){
		return str;
	}

	var hash = 0, i, chr;
  if (str.length == 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = hash.toString(36); // Convert to alphanum string
  return hash;
}

// http://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-property-in-javascript
function hasProp(obj, prop) {
	if( typeof(obj) == "object" ){
		var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
	}
	return false;
}

// JavaScript objects are crap
// The only real thing you need to instantiate are arrays
// create functions to mimic casting

function Event( passedObj ) {
	var obj = passedObj;
	obj.teams = [];
	obj.scorers = [];
	obj.stations = [];
	return obj;
}

function Team( passedObj ) {
	var obj = passedObj;
	obj.persons = [];
	return obj;
}

function Person( passedObj ) {
	var obj = passedObj;
	obj.stations = [];
	return obj;
}

/*

************** Function Templates **************
I reuse these a lot but need to be rewritten everytime.

// generic ajax call format.
$.ajax({
	url: url + "url_to_api_call" + passed_var,
	success: function( result ){
		// what to do with result from api call
  },
  // error function can stay same for all calls.
  error: function( jqXHR, textStatus, errorThrown ){
  	// if status is not zero, we have an error we didn't expect
  	if( jqXHR.status ) {
  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
  	}
  	// if status is zero, no internet
  	else {
  		alert( "No internet connection, cannot update event info at this time." );
  	}
  }
});



************** Function Graveyard **************
I wrote these and ended up not using them. FML.

// get an event and update it
function updateEventInfo( eventID ){
	// Call api to get event info
	$.ajax({
		// get event by id call
		url: url + "get/event/get_event.php?event_id=" + eventID,
		success: function( result ){
			// result will be json string
			result = JSON.parse( result );
			if( !result ) {
				alert("No event found by that id.");
				return false;
			}
			// result is an array of length 1 of event objects.
      localStorage.setItem( "eventID_" + eventID, JSON.stringify( result ) );
      toast( "Event " + result[0].name + " updated" );
      console.log( "Event info for " + result.name + " stored in local storage under 'eventID_" + eventID + "'" );
    },
    error: function( jqXHR, textStatus, errorThrown ){
    	// if status is not zero, we have an error we didn't expect
    	if( jqXHR.status ) {
    		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
    	}
    	// if status is zero, no internet
    	else {
    		alert( "No internet connection, cannot update event info at this time." );
    	}
    }
  });
}

// checks if user exists. Allows for callbacks to handle true and false
function userExists( email, isAdmin, true_cb, false_cb ){
		// authenticate user before allowing login.
	ajax_url = url;
	if( isAdmin )
		ajax_url += "get/admin/get_admin.php?email=" + email;
	else
		ajax_url += "get/scorer/get_scorer.php?email=" + email;
	$.ajax({
		url: ajax_url,
		success: function( result ){
			// what to do with result from api call
			if( JSON.parse( result ) ){
				true_cb();
			}
			else
				false_cb();
	  },
	  // error function can stay same for all calls.
	  error: function( jqXHR, textStatus, errorThrown ){
	  	// if status is not zero, we have an error we didn't expect
	  	if( jqXHR.status ) {
	  		alert( textStatus + " " + jqXHR.status + " " + errorThrown );
	  	}
	  	// if status is zero, no internet
	  	else {
	  		alert( "No internet connection, cannot update event info at this time." );
	  	}
	  }
	});
}

*/
