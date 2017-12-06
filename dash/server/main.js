date = new Date();

Meteor.startup(() => {
    Meteor.publish('userPresence', function() {
      // Setup some filter to find the users your user
      // cares about. It's unlikely that you want to publish the 
      // presences of _all_ the users in the system.

      // If for example we wanted to publish only logged in users we could apply:
      // filter = { userId: { $exists: true }};
      var filter = {}; 

      return Presences.find(filter, { fields: { state: true, userId: true, peerID: true }});
    });


    Meteor.methods({
        createMember: function(memId, username, firstname, lastname, zipcode, email, phone, skills, interests) {
            name = firstname + lastname[0]
            members.insert({
                "MemberID": memId,
                "Username": username,
                "FirstName": firstname,
                "LastName": lastname,
                // "Name": name,
                "Zipcode": zipcode,
                "Email": email,
                "Phone": phone,
                "Skills": skills,
                "Interests": interests,
                "CreatedAt": date.getTime()
            });
            return name;
        },

        logInteraction: function(info) {
            interactions.insert({
                "Time": date.getTime(),
                "Data": info
            });
        },

        logActivity: function(memId, name, activity, locationID, location) {
            Meteor.call("logOut", memId);
            activities.insert({
                "LoggedIn": date.getTime(),
                "Name": name,
                "MemberID": memId,
                "CurrentActivity": activity,
                "Location": location,
                "locationID": locationID,
                "Status": "in"
            });
            return "logged";
        },

        clearCardUser: function (memId) {
            members.remove({"MemberID": memId});
            Meteor.call("logOut", memId);
            return "Card cleared";
        },

        logOut: function (memId) {
            activities.update({"MemberID": memId}, {$set: {"Status": "out", "LogOutTime": date.getTime()}}, {multi: true});
            return true;
        },

        checkLogins: function () {
            console.log("checking")
            timeOut = 18000000;
            // timeOut = 5000;
            activities.find({$and: [{"LoggedIn": {$lt: (date.getTime() - timeOut)}}, {"Status": "in"}]}).forEach(function (doc) {
                Meteor.call("logOut", doc.MemberID);
                console.log("logging out " + doc.MemberID);
            });
        },

        test: function (tex) {
            console.log(tex);
        },

        setDisplaySpace: function (uid, space1, space2) {
            displaySpaces.update(
                {"roomID": uid, "location": "space1"},
                {"roomID": uid, "location": "space1", "spaceID": space1},
                // {$setOnInsert: {"roomID": uid, "location": "space1"} },
                {upsert: true, multi:false} 
            );
            console.log(space1 + " " + uid);
            displaySpaces.update(
                {"roomID": uid, "location": "space2"},
                {"roomID": uid, "location": "space2", "spaceID": space2},
                {upsert: true, multi:false}
            );

            Meteor.call("addInterests", uid);

        },

        addInterests: function (uid) {
            bodgeryInterests = [
                {
                    "space": 0,
                    "interest": "3D Printing",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Alex K."},
                        {"name": "Clint C."},
                        {"name": "Grant D."},
                        {"name": "John T."},
                        {"name": "Ken B."},
                        {"name": "Kevin T."},
                        {"name": "Matthew M."},
                        {"name": "Michael C."},
                        {"name": "Peter L."},
                        {"name": "Sam M."},
                        {"name": "Sean G."},
                        {"name": "Timm M."},
                        {"name": "Tom H."}
                    ],
                    "visitTimes": [
                        {"day": "Friday: ", "time": "Most Likely"},
                        {"day": "Monday: ", "time": "Second most likely"},
                        {"day": "Saturday: ", "time": "Third most likely"},
                    ],
                    "subInterests": "",
                    "subInterestArray": []
                },
                {
                    "space": 0,
                    "interest": "Electronics",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Alex K"},
                        {"name": "Cole H"},
                        {"name": "David B"},
                        {"name": "James P"},
                        {"name": "Jason N"},
                        {"name": "John E"},
                        {"name": "John T"},
                        {"name": "Jonah B"},
                        {"name": "Josef H"},
                        {"name": "Justin D"},
                        {"name": "Kevin T"},
                        {"name": "Lorenzo L"},
                        {"name": "Marshall S"},
                        {"name": "Matthew F"},
                        {"name": "Matthew M"},
                        {"name": "Parker S"},
                        {"name": "Sam M"},
                        {"name": "Sarah C"},
                        {"name": "Sean G"},
                        {"name": "Timm M"},
                        {"name": "Tom H"},
                        {"name": "Weston W"},
                        {"name": "Will M"}                    
                    ],
                    "visitTimes": [
                        {"day": "Friday: ", "time": "Most Likely"},
                        {"day": "Monday: ", "time": "Second most likely"},
                        {"day": "Saturday: ", "time": "Third most likely"},
                    ],
                    "subInterests": "Soldering, Microcontrollers, RPi, Arduino",
                    "subInterestArray": ["Soldering", "Microcontrollers", "RPi", "Arduino"]
                },
                {
                    "space": 0,
                    "interest": "Crafting",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Alex K"},
                        {"name": "Andrea C"},
                        {"name": "Anhthu H"},
                        {"name": "Brad S"},
                        {"name": "Cassie B"},
                        {"name": "Cody J"},
                        {"name": "Dawn C"},
                        {"name": "Evan U"},
                        {"name": "Hilllary B"},
                        {"name": "Iris N"},
                        {"name": "James V"},
                        {"name": "Jolyn S"},
                        {"name": "Karen C"},
                        {"name": "Liz A"},
                        {"name": "Luke B"},
                        {"name": "Myranda H"},
                        {"name": "Owen L"},
                        {"name": "Robert S"},
                        {"name": "Sam M"},
                        {"name": "Sarah C"},
                        {"name": "Sean G"},
                        {"name": "Susan S"},
                        {"name": "Sylvia L"},
                        {"name": "Theo H"},
                        {"name": "Zachery G"}
                    ],
                    "visitTimes": [
                        {"day": "Monday: ", "time": "Most Likely"},
                        {"day": "Saturday: ", "time": "Second most likely"},
                        {"day": "Friday: ", "time": "Third most likely"},
                    ],
                    "subInterests": "Fiber, Paper, Jewelery, Vinyl, Costuming",
                    "subInterestArray": ["Fiber", "Paper", "Jewelery", "Vinyl", "Costuming"]
                },
                {
                    "space": 0,
                    "interest": "CNC",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Alex K"},
                        {"name": "Bryant S"},
                        {"name": "Eric H"},
                        {"name": "John E"},
                        {"name": "Josh L"},
                        {"name": "Justin D"},
                        {"name": "Karen C"},
                        {"name": "Liz A"},
                        {"name": "Michael C"},
                        {"name": "Natsuko S"},
                        {"name": "Sam M"},
                        {"name": "Sean G"}
                    ],
                    "visitTimes": [
                        {"day": "Friday: ", "time": "Most Likely"},
                        {"day": "Monday: ", "time": "Second most likely"},
                        {"day": "Saturday: ", "time": "Third most likely"},
                    ],
                    "subInterests": "Laser cutting, Carvey, Milling",
                    "subInterestArray": ["Laser cutting", "Carvey", "Milling"]
                },
                {
                    "space": 0,
                    "interest": "Metal Shop",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Alex K"},
                        {"name": "Brad S"},
                        {"name": "Bryant S"},
                        {"name": "Cole H"},
                        {"name": "Dave B"},
                        {"name": "James V"},
                        {"name": "John E"},
                        {"name": "Josef H"},
                        {"name": "Josh L"},
                        {"name": "Ka L"},
                        {"name": "Karen C"},
                        {"name": "Randy N"},
                        {"name": "Roger S"},
                        {"name": "Ryan D"},
                        {"name": "Sam M"},
                        {"name": "Sean G"},
                        {"name": "Weston W"},
                        {"name": "Zachary W"}
                    ],
                    "visitTimes": [
                        {"day": "Friday: ", "time": "Most Likely"},
                        {"day": "Monday: ", "time": "Second most likely"},
                        {"day": "Saturday, Tuesday, and Wednesday: ", "time": "Third most likely"},
                    ],
                    "subInterests": "Welding, Blacksmithing",
                    "subInterestArray": ["Welding", "Blacksmithing"]
                },
                {
                    "space": 0,
                    "interest": "Vehicles",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Adam J"},
                        {"name": "Alex K"},
                        {"name": "Grant D"},
                        {"name": "Sam M"},
                        {"name": "Sean G"}
                    ],
                    "visitTimes": [
                        {"day": "Monday, Friday: ", "time": "Most Likely"},
                        {"day": "Tuesday, Wednesday, Saturday, Sunday: ", "time": "Second most likely"},
                        // {"day": "Saturday: ", "time": "Third most likely"},
                    ],
                    "subInterests": "Power racing, Auto, Drones",
                    "subInterestArray": ["Power racing", "Auto", "Drones"]
                },
                {
                    "space": 0,
                    "interest": "Programming",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Alex K"},
                        {"name": "Grant D"},
                        {"name": "James P"},
                        {"name": "Jason N"},
                        {"name": "John E"},
                        {"name": "Jonah B"},
                        {"name": "Marshall S"},
                        {"name": "Matthew F"},
                        {"name": "Parker S"},
                        {"name": "Robert S"},
                        {"name": "Sam M"},
                        {"name": "Sean G"},
                        {"name": "Sean K"},
                        {"name": "Theo H"},
                        {"name": "Timm M"}
                    ],
                    "visitTimes": [
                        {"day": "Monday: ", "time": "Most Likely"},
                        {"day": "Friday: ", "time": "Second most likely"},
                        {"day": "All the other days: ", "time": "Third most likely"},
                    ],
                    "subInterests": "",
                    "subInterestArray": []
                },
                {
                    "space": 0,
                    "interest": "Wood Shop",
                    "contactPerson": "Karen W.",
                    "visitTimesText": "Mondays 3-5pm",
                    "peopleInterest": [
                        {"name": "Aaron H"},
                        {"name": "Alex K"},
                        {"name": "Alex C"},
                        {"name": "Alexander A"},
                        {"name": "Andrea C"},
                        {"name": "Andrew C"},
                        {"name": "Anhthu H"},
                        {"name": "Brad S"},
                        {"name": "Bryant S"},
                        {"name": "Cal F"},
                        {"name": "Clint C"},
                        {"name": "Cole H"},
                        {"name": "Dan H"},
                        {"name": "Dave B"},
                        {"name": "Gaelan T"},
                        {"name": "Glenn T"},
                        {"name": "Herthel S"},
                        {"name": "James V"},
                        {"name": "Jason N"},
                        {"name": "Jim F"},
                        {"name": "Jim W"},
                        {"name": "John E"},
                        {"name": "John T"},
                        {"name": "Jon A"},
                        {"name": "Jonah B"},
                        {"name": "Josef H"},
                        {"name": "Julian C"},
                        {"name": "Justin D"},
                        {"name": "Ka L"},
                        {"name": "Karen C"},
                        {"name": "Katie D"},
                        {"name": "Kevin T"},
                        {"name": "Kurt H"},
                        {"name": "Lacey P"},
                        {"name": "Lisa S"},
                        {"name": "Liz A"},
                        {"name": "Lucy G"},
                        {"name": "Marshall S"},
                        {"name": "Matthew M"},
                        {"name": "Matthew M"},
                        {"name": "Michael B"},
                        {"name": "Myranda H"},
                        {"name": "Natsuko S"},
                        {"name": "Parker S"},
                        {"name": "Randy N"},
                        {"name": "Roger S"},
                        {"name": "Sam M"},
                        {"name": "Sean G"},
                        {"name": "Tyler G"},
                        {"name": "Weston W"},
                        {"name": "Will M"},
                        {"name": "Zachary W"}
                    ],
                    "visitTimes": [
                        {"day": "Friday: ", "time": "Most Likely"},
                        {"day": "Wednesday, Saturday: ", "time": "Second most likely"},
                        // {"day": "Saturday: ", "time": "Third most likely"},
                    ],
                    "subInterests": "Furniture",
                    "subInterestArray": ["Furniture"]
                },
            ]
            for (i in bodgeryInterests) {
                Meteor.call("addInterest", uid, bodgeryInterests[i]);
            }
        },

        addInterest: function (uid, interest) {
            interest["space"] = uid
            interests.insert(interest);
        }
    });

    Meteor.setInterval(function () {
        Meteor.call('checkLogins');
    }, 300000);
    // }, 1000);
});


Meteor.publish('members', function tasksPublication() {
    return members.find();
});

Accounts.onCreateUser(function (options, user) {
    console.log(user._id); 

    Meteor.call("setDisplaySpace", user._id, user._id, user._id);
    return user;
});