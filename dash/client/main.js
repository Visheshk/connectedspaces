import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Session.set("locationSet", true);
Session.set("refreshBox", true);
Session.set("peerId", 0);

Session.set("streamSettings", {audio: true, video: true});

Meteor.subscribe('userPresence');

Template.boxes.helpers({
	spacesToDisplay: function () {
		return displaySpaces.find({$and: [{"roomID": Meteor.userId() }, {"location": "space1" }]});
	},

	spaceName: function () {
		// console.log(this.spaceID);
		return Meteor.users.findOne({_id: this.spaceID}).username;
	},

	allData: function() {
		// Mousetrap.bind('4', function() { console.log('4'); });
		// if (Session.get("locationSet") == true){
		// 	Session.set("locationSet", false);
		// }
		// console.log(Template.instance().paneLocation);
		// if (Template.instance().paneLocation != 0){
		// 	return activities.find({$and: [{locationID: Template.instance().paneLocation}, {Status: "in"}]}).fetch();
		// }
		// else {
		// 	return activities.find({$and: [{locationID: Meteor.users.findOne()._id}, {Status: "in"}]}).fetch();
		// }
		// console.log(this.spaceID);
		thisID = this.spaceID;
		return activities.find({$and: [{locationID: thisID}, {Status: "in"}]}).fetch();
	}
});

Template.activityEntry.helpers({
	name() {
		// chosenAction = ""
		// Mousetrap.bind('m', function() { 
		// 	chosenAction = "3D Modeling";
		// 	console.log(chosenAction); 
		// 	logAct(chosenAction);
		// });
		// Mousetrap.bind('p', function() { 
		// 	chosenAction = "Programming";
		// 	console.log(chosenAction); 
		// 	logAct(chosenAction);
		// });
		// Mousetrap.bind('v', function() { 
		// 	chosenAction = "Video Production";
		// 	console.log(chosenAction); 
		// 	logAct(chosenAction);
		// });

		logAct = function (act) {
			Meteor.call("logActivity", 
				Session.get("Member"), 
				Session.get("Name"), 
				act, 
				Meteor.userId(), 
				Meteor.user().username, 
					function (err, res){
				if(err){
					alert("couldn't log activity! Something wrong with server :(");
					Router.go('/');
				}
				else {
					Router.go('/');
				}
			});
		}

		memb = members.findOne({"MemberID": Session.get("Member")});
		if (memb != undefined){
			Session.set("Name", members.findOne({"MemberID": Session.get("Member")}).FirstName);	
		}
		else {
			Session.set("Name", "");
			// alert("Authentication failed! Sending you back home");
			Session.set("Member", undefined);
			Router.go("/");
		}

		if (Session.get("Name").trim() == ""){
			return "<<empty name>>";
		}
		else {
			return Session.get("Name");	
		}
	},

	interests: function() {
		// console.log(interests.find({$and: [{"space": Meteor.userId()}]}));
		return interests.find({$and: [{"space": Meteor.userId()}]});
	},

	anySubs: function () {
		console.log(this.subInterests);
		return this.subInterests != "";
	},

	userInterests: function() {
		// console.log(interests.find({$and: [{"space": Meteor.userId()}]}));
		
		console.log(members.findOne({"MemberID": Session.get("Member")}).Interests);
		return members.findOne({"MemberID": Session.get("Member")}).Interests;
	},
});

Template.interestPeople.helpers({
	peopleOfInterest: function () {
		// console.log(interests.findOne({"interest": String(this)}).peopleInterest);
		return interests.findOne({"interest": String(this)}).peopleInterest;
	}
})

Template.interestTimes.helpers({
	timesOfInterest: function () {
		// console.log(interests.findOne({"interest": String(this)}).peopleInterest);
		return interests.findOne({"interest": String(this)}).visitTimes;
	}
})

Template.memberCheck.onCreated(function () {
	memid = Session.get("Member");
	if (members.findOne({"MemberID": memid})) {
		// uname = 
		// Session.set("Username", "name");
		Router.go("/actitout");
	}
	// else if (members.findOne({"MemberCard": memid})) {
	// 	Session.set("Mode", "name");
	// 	Router.go("/actitout");	
	// }
	else {
		Router.go("/newMember");	
	}
});

Template.memberEnter.events({
	'submit .usernameForm': function(event) {
		event.preventDefault();
		// console.log("username " + event.target.username.value);
		uname = event.target.username.value.trim();
		Router.go('/member/' + uname);
		//// *** TODO: reinstate log activity here *** ////
		// Meteor.call("logActivity",
		// 	Session.get("Member"), 
		// 	Session.get("Name"), 
		// 	event.target.activity.value, 
		// 	Meteor.userId(), 
		// 	Meteor.user().username, 
		// 	function (err, res){
		// 	if(err){
		// 		alert("couldn't log activity! Something wrong with server :(");
		// 		Router.go('/');
		// 	}
		// 	else {
		// 		Router.go('/');
		// 	}
		// });
	}
});

Template.activityEntry.events({
	'click .reset-form': function (event){
		Session.set("Member", undefined);
		Session.set("Name", undefined);
		Router.go("/");
	},

 	'submit .activityForm': function(event) {
		event.preventDefault();
		Meteor.call("logActivity", 
			Session.get("Member"), 
			Session.get("Name"), 
			event.target.activity.value, 
			Meteor.userId(), 
			Meteor.user().username, 
			function (err, res){
			if(err){
				alert("couldn't log activity! Something wrong with server :(");
				Router.go('/');
			}
			else {
				alert("Activity Logged!");
				Router.go('/');
			}
		});
	},

	'click .activity': function (event){
		Meteor.call("logActivity", 
			Session.get("Member"), 
			Session.get("Name"), 
			event.currentTarget.name, 
			Meteor.userId(), 
			Meteor.user().username, 
			function (err, res){
			if(err){
				alert("couldn't log activity! Something wrong with server :(");
				Router.go('/');
			}
			else {
				alert("Activity Logged!");
				Router.go('/');
			}
		});
	},

	'click .gohome': function(event) {
		// console.log('want to');
		// Meteor.call("clearCardUser", Session.get("Member"), function (err, res){
		// 	if(err) {
		// 		alert("Server troubles :(");
		// 		Router.go("/");
		// 	}
		// 	else {
		// 		Router.go("/newMember");
		// 	}
		// })
		console.log('want to');
		Meteor.call("clearCardUser", Session.get("Member"), function (err, res){
			if(err) {
				alert("Server troubles :(");
				Router.go("/");
			}
			else {
				Router.go("/newMember");
			}
		});
	},

	'click .updateCard': function(event) {
		console.log('want to');
		Meteor.call("clearCardUser", Session.get("Member"), function (err, res){
			if(err) {
				alert("Server troubles :(");
				Router.go("/");
			}
			else {
				Router.go("/newMember");
			}
		})
	},

	'click .logOut': function (event) {
		Meteor.call("logOut", Session.get("Member"), function(err, res) {
			if (err){
				alert("Server failed to log you out :(")
				Router.go('/');
			}
			else {
				Router.go('/');
			}
		});
	}
});

Template.signUp.helpers({
	firstname: function () {
		return(Session.get("Member").split(" ")[0]);
	},

	lastname: function () {
		name = Session.get("Member");
		name = name.trim();
		// Session.set("Member", name);
		names = name.split(" ");
		console.log(names)
		if (names.length == 1){
			return(" ");
		}
		else {
			return(names[(names.length - 1)]);
		}

	},

	interests: function() {
		// console.log(interests.find({$and: [{"space": Meteor.userId()}]}));
		return interests.find({$and: [{"space": Meteor.userId()}]});
	}
});

Template.signUp.events({
	'click .reset-form': function (event) {
		Session.set("Member", 0);
		Router.go("/");
	}
	,
	'submit .signup': function(event) {
		event.preventDefault();
		console.log("signedup");
		allSkills = interests.find({$and: [{"space": Meteor.userId()}]}, {"interest": 1});
		function getInterest (x) {
			return x["interest"]
		}
		skillList = allSkills.map(function (x) { return (x["interest"]);} )
		// console.log(event.target[skillList[0] + "-skill"].checked);
		// console.log(event.target[skillList[0] + "-skill"].value);
		skillsChecked = [];
		interestsChecked = [];
		for (s in skillList) {
			// if (event.target[skillList[s] + "-skill"].checked){
			// 	skillsChecked.push(skillList[s]);
			// }
			if (event.target[skillList[s] + "-interest"].checked){
				interestsChecked.push(skillList[s]);
			}
		}
		// console.log(skillsChecked);
		// console.log(interests);
		uname = event.target.firstname.value.toLowerCase() + event.target.lastname.value.toLowerCase();
		Session.set("Username", uname)
		Meteor.call("createMember", 
			Session.get("Member"), 
			uname,
			event.target.firstname.value, 
			event.target.lastname.value, 
			event.target.zipcode.value, 
			event.target.emailadd.value,
			event.target.phone.value,
			skillsChecked,
			interestsChecked,
			function (err, res) {
			if (err) {
				alert("sign up failed at server end! :(");
			}
			else {
				console.log(res)
				Session.set("Name", res);
				Router.go('/actitout');
			}
		});
	}
});


Template.administration.helpers({
	otherLocations: function () {
		// users = Meteor.users.find({_id: {$ne: Meteor.userId()}});
		users = Meteor.users.find();

		// numb = users.count();
		return users;
	}
});

Template.administration.events({
	'submit .locationSelector': function(event) {
		event.preventDefault();
		Meteor.call("setDisplaySpace", Meteor.userId(), event.target.location1.value, event.target.location2.value);
		Router.go("/");
	},

	'click .logOut': function () {
		// console.log("logging out?");
		AccountsTemplates.logout();
		Router.go('/setLocation');
	}
});


