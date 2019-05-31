# BidOrBoo

Getting Started

- make sure to have the following requirements

```
"node": "10.15.1",
"npm": "6.4.1",
"yarn": "1.12.1"
```

- if you do not have the right version of node or npm you have 2 choices :
* install them (you can find guides online on how to install these)

OR

* you need to to the root directory package.json and delete the engines attribute from the json file
  BUT MAKE SURE YOU DO NOT MERGE OR COMMIT THIS CHANGE as that is used by heroku to deploy this app

- git clone this repo

```
git clone git@github.com:bidorboocrew/bidorboo.git
```

- In the root directory run the follwing

```
yarn run devSetup

this should take around (5-10 minutes)

yarn run devStart
```

Happy coding
