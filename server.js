'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('db', 'root', '')

let app = express()
app.use(express.static(__dirname + '/app'))
app.use(bodyParser.json())
app.locals.subsidiaries = []

let Subsidiary = sequelize.define('subsidiary', {
	Name: {
		allowNull: false,
		type: Sequelize.STRING,
		  validate:{
      len:[2,30],
      isAlpha:true
      
      }
		
	},
	
	Caen: {
		allowNull: false,
		type: Sequelize.STRING,
		  validate:{
      len:[2,30],
      isAlpha:true
      
      }
	},
	
  Fax: {
		allowNull: true,
		type: Sequelize.INTEGER
	},
	
	In: {
		allowNull: false,
		type: Sequelize.STRING,
		  validate:{
      len:[2,30]
      
      }
	}
	
})

let Company = sequelize.define('companies', {
	Name: {
		allowNull: false,
		type: Sequelize.STRING
	},
	City: {
		allowNull: false,
		type: Sequelize.STRING,
		validate: {
			len: [5, 1000]
		}
	},
	Company:{
		allowNull: false,
		type: Sequelize.STRING
	},
	
	PC:{
		allowNull: false,
		type: Sequelize.INTEGER
	},
	
})



Subsidiary.hasMany(Company, {
	foreignKey: 'subsidiaryId'
})
Company.belongsTo(Subsidiary, {
	foreignKey: 'subsidiaryId'
})

app.get('/create', (req, res) => {
  sequelize
    .sync({
      force: true
    })
    .then(() => {
      res.status(201).send('created')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.get('/subsidiaries', (req, res) => {
  Subsidiary
    .findAll({
      attributes: ['id', 'Name', 'Caen', 'In', 'Fax']
    })
    .then((subsidiaries) => {
      res.status(200).send(subsidiaries)
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.post('/subsidiaries', (req, res) => {
  Subsidiary
    .create(req.body)
    .then(() => {
      res.status(201).send('created')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})



app.get('/subsidiaries/:id', (req, res) => {
  Subsidiary
    .find({
      attributes: ['id', 'Name', 'Caen', 'In', 'Fax'],
      where: {
        id: req.params.id
        
      }
    })
    .then((subsidiary) => {
      res.status(200).send(subsidiary)
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.delete('/subsidiaries/:id', (req, res) => {
  Subsidiary
    .find({
      where: {
        id: req.params.id
      }
    })
    .then((subsidiary) => {
      return subsidiary.destroy()
    })
    .then(() => {
      res.status(201).send('removed')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.put('/subsidiaries/:id', (req, res) => {
  Subsidiary
    .find({
      where: {
        id: req.params.id
      }
    })
    .then((subsidiary) => {
      return subsidiary.updateAttributes(req.body)
    })
    .then(() => {
      res.status(201).send('modified')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.get('/subsidiaries/:id/companies', (req, res) => {
  Subsidiary
    .find({
      where: {
        id: req.params.id
      },
      include: [Company]
    })
    .then((subsidiary) => {
     
      return subsidiary.getCompanies()
    })
    .then((company) => {
      res.status(200).send(company)
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.get('/subsidiaries/:id/companies/:mId', (req, res) => {
  Company
    .find({
      attributes: ['id', 'Name', 'City', 'Company', 'PC'],
      where: {
        id: req.params.mId
      }
    })
    .then((company) => {
      res.status(200).send(company)
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.post('/subsidiaries/:id/companies', (req, res) => {
  Subsidiary
    .find({
      where: {
        id: req.params.id
      }
    })
    .then((subsidiary) => {
      let company = req.body
      company.subsidiaryId = subsidiary.id
      return Company.create(company)
    })
    .then(() => {
      res.status(201).send('created')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.put('/subsidiaries/:id/companies/:mId', (req, res) => {
  Company
    .find({
      where: {
        id: req.params.mId
      }
    })
    .then((company) => {
      company.Name = req.body.Name
      company.City = req.body.City
      company.Company=req.body.Company
      company.PC=req.body.PC
      return company.save()
    })
    .then(() => {
      res.status(201).send('modified')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })

})

app.delete('/subsidiaries/:id/companies/:mId', (req, res) => {
  Company
    .find({
      where: {
        id: req.params.mId
      }
    })
    .then((company) => {
      return company.destroy()
    })
    .then(() => {
      res.status(201).send('removed')
    })
    .catch((error) => {
      console.warn(error)
      res.status(500).send('error')
    })
})

app.listen(process.env.PORT)
