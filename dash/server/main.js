// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';


// console.log("mongodb://" + mongo_user + ":" + mongo_pass + "@" +  mongo_ip + ":27017/cspace");
// db = new MongoInternals.RemoteCollectionDriver("mongodb://" + mongo_user + ":" + mongo_pass + "@" +  mongo_ip + ":27017/cspace");
// export const members = new Mongo.Collection("members", {_driver: db});
// export const activities = new Mongo.Collection("activities", {_driver: db});

date = new Date();

Meteor.startup(() => {

    // SSLProxy({
    //    port: 6000, //or 443 (normal port/requires sudo)
    //    ssl : {
    //         key: Assets.getText("server.key"),
    //         cert: Assets.getText("server.crt"),
    //         //Optional CA
    //         //Assets.getText("ca.pem")
    //    }
    // });

	// console.log(rests.findOne({}));
	// console.log(members.findOne({}));
    // code to run on server at startup
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
        createMember: function(memId, name, zipcode, email, phone) {
            members.insert({
                "MemberID": memId,
                "Name": name,
                "Zipcode": zipcode,
                "Email": email,
                "Phone": phone,
                "CreatedAt": date.getTime()
            });
            return name;
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
                    "interest": "Woodworking",
                    "contactPerson": "Karen",
                    "visitTimes": ["Mondays, 3-5pm"]
                },
                {
                    "space": 0,
                    "interest": "Machining",
                    "contactPerson": "Karen",
                    "visitTimes": ["Mondays, 3-5pm"]
                },
                {
                    "space": 0,
                    "interest": "Crafts",
                    "contactPerson": "Karen",
                    "visitTimes": ["Mondays, 3-5pm"]
                },
                {
                    "space": 0,
                    "interest": "Electronics",
                    "contactPerson": "Karen",
                    "visitTimes": ["Mondays, 3-5pm"]
                },
            ]
            for (i in bodgeryInterests) {
                Meteor.call("addInterest", uid, bodgeryInterests[i]);
            }
        },

        addInterest: function (uid, interest) {
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