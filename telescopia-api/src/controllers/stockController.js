const mongoose = require('mongoose')

const stockStatSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

const stockSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stats: [stockStatSchema]
})

const stockModel = mongoose.model('Stocks', stockSchema)

exports.getAllStocks = (req, res, next) => {
    stockModel.find({}, (err, stocks) => {
        if (err) {
            res.status(200).send({ status: 'failure' })
            console.log(err)
        } else
            res.status(200).send({ status: 'success', message: stocks })
    })
}

exports.getStockByName = (req, res, next) => {
    let stockName = req.params.stockName.toUpperCase();
    stockModel.findOne({ name: stockName }, (err, stock) => {
        if (err) {
            res.status(200).send({ status: 'failure' })
            console.log(err)
        } else
            if (stock)
                res.status(200).send({ status: 'success', message: stock })
            else
                res.status(200).send({ status: 'failure', message: "Ação não encontrada."})
    })
}

exports.getStocksNames = (req, res, next) => {
    stockModel.find({}, 'name -_id', (err, stocksNames) => {
        if (err) {
            res.status(200).send({ status: 'failure' })
            console.log(err)
        } else
            if (stocksNames)
                res.status(200).send({ status: 'success', message: stocksNames })
            else
                res.status(200).send({ status: 'failure', message: "Não há ações cadastradas."})
    })
}

exports.newStock = (req, res, next) => {
    req.body.name = req.body.name.toUpperCase()
    let stockName = req.body.name
    stockModel.findOne({ name: stockName }, (err, stock) => {
        if (err) {
            res.status(200).send({ status: 'failure' })
            console.log(err)
        } else {
            if (stock) {
                stockModel.findOneAndUpdate({ name: stockName }, { "$push": { "stats": { "$each": req.body.stats }}}, (err) => {
                    if (err) {
                        res.status(200).send({ status: 'failure', message: 'Não foi possível atualizar a ação.' })
                        console.log(err)
                    } else
                        res.status(200).send({ status: 'success', message: 'Ação atualizada com sucesso.' })
                })
            } else {
                stockModel.create(req.body, (err, stocks) => {
                    if (err) {
                        res.status(200).send({ status: 'failure', message: 'Não foi possível criar a ação.' })
                        console.log(err)
                    }
                    else
                        res.status(200).send({ status: 'success', message: 'Ação inserida com sucesso.' })
                })
            }
        }   
    })
}

exports.getNumberOfStocks = (req, res, next) => {
    stockModel.countDocuments({}, (err, count) => {
        if (err)
            res.status(200).send({ status: 'failure' })
        else
            res.status(200).send({ status: 'success', count: count })
    })
}