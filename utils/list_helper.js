const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (maxLikesBlog, item) => {
        if(maxLikesBlog.likes < item.likes){
            return { title: item.title,
                author: item.author,
                likes: item.likes            
            }
        }
        
        return maxLikesBlog
    }
    
    return blogs.reduce(reducer, { likes: 0 })
}

const mostBlogs = (blogs) => {
    const authorDictReducer = (authorDict, item) => {
        if(!authorDict[item.author]){
            authorDict[item.author] = {
                author: item.author,
                blogs: 1
            }
        }        
        else {
            authorDict[item.author].blogs += 1
        }      
        
        return authorDict
    }
    const authorDict = blogs.reduce(authorDictReducer, [])

    const maxBlogReducer = (maxBlogAuthor, item) => {
        if(maxBlogAuthor.blogs < item.blogs){
            return { author: item.author,
                blogs: item.blogs            
            }
        }
        
        return maxBlogAuthor
    }
    authorBlogList = []
    for (let [key, value] of Object.entries(authorDict)){
        authorBlogList.push(value)
    }  
    return authorBlogList.reduce(maxBlogReducer, { blogs: 0})
}

const mostLikes = (blogs) => {
    const authorDictReducer = (authorDict, item) => {

        authorDict[item.author] = {
            author: item.author,
            likes: (!authorDict[item.author]) ? item.likes : item.likes + authorDict[item.author].likes
        }      
        
        return authorDict
    }
    const authorDict = blogs.reduce(authorDictReducer, [])

    const maxLikesReducer = (maxLikesAuthor, item) => {
        if(maxLikesAuthor.likes < item.likes){
            return { 
                author: item.author,
                likes: item.likes          
            }
        }        
        return maxLikesAuthor
    }
    authorLikesList = []
    for (let [key, value] of Object.entries(authorDict)){
        authorLikesList.push(value)
    }  
    return authorLikesList.reduce(maxLikesReducer, { likes: 0})
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
