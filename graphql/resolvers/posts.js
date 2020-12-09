const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports = {
    Query: {
        async getPosts(){
            try {
                const posts = Post.find().sort({createdAt: -1});
                return posts;
            } catch (error) {
                throw new Error(err);
            }
        },
        async getPost(_, {postId}){
            try {
                console.log(postId);
                
                const post = await Post.findById(postId);
                if(post){
                    return post;
                }else{
                    throw new Error('Post not found');
                }
            } catch (error) {
                throw new Error(error);
            }
        }
    },
    Mutation:{
        async createPost(_, {body}, ctx, info){
            const user = checkAuth(ctx);
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, {postId}, ctx, info){
            const user = checkAuth(ctx);
            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post deleted sucessfully';
                }else{
                    throw new AuthenticationError('Action not allowed');
                }
            }catch(err){
                throw new Error(err)
            }
        }
    }
}