const express = require('express')
const Post = require('../models/post')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/posts', auth, async (req, res) => {
    // const post = new Post(req.body)
    const post = new Post({
        ...req.body,
        owner: req.user._id
    })

    try {
        await post.save()
        res.status(201).send(post)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/posts', auth, async (req, res) => {
    try {
        // GET /posts?completed=true
        // GET /posts?limit=10&skip=20
        // GET /posts?sortBy=createdAt:desc

        // const posts = await Post.find({
        //     owner: req.user._id,
        // })
        // res.send(posts)

        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        await req.user.populate({
            path: 'posts',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.posts)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/posts/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const post = await Post.findOne({
            _id,
            owner: req.user._id
        })

        if (!post) {
            return res.status(404).send()
        }
        res.send(post)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/posts/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates!'
        })
    }

    try {
        const post = await Post.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!post) {
            return res.status(404).send()
        }

        updates.forEach((update) => post[update] = req.body[update])
        await post.save()
        res.send(post)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/posts/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!post) {
            return res.status(404).send()
        }

        res.send(post)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/posts/deleteAll', auth, async (req, res) => {
    res.send('test')
    // try {
    //     const posts = await Post.find({
    //         owner: user._id
    //     })

    //     if (!posts) {
    //         return res.status(404).send()
    //     }

    //     post.deleteMany()
    // } catch (e) {
    //     res.status(400).send(e)
    // }
})

module.exports = router