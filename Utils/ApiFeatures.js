class ApiFeatures{
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }
    filter(){
        const fieldsToExclude = ['sort','fields','page','size']
        const queryParams  = {...this.queryStr}
        if(queryParams){
         fieldsToExclude.forEach(field=>{
             delete queryParams[field]
         })
        }
        this.query = this.query.find(queryParams)
        // this.queryStr = queryParams
        return this

    }
    sort(){
        console.log("the fields inside sort fields",this.queryStr)
        if(this.queryStr?.sort){
            this.query = this.query.sort(this.queryStr.sort.split(',').join(' '))
         }
         else{
          this.query = this.query.sort('-createdAt')
         }
         return this
    }
    limitFields(){
        console.log("the fields inside query fields",this.queryStr)
        if(this.queryStr?.fields){
            this.query = this.query.select(this.queryStr.fields.split(',').join(' '))
           }
           else{
            this.query = this.query.select('-__v')
           }
        return this   
    }
    paginate(){
        console.log("the fields inside query paginate",this.queryStr)
        const page = this.queryStr?.page || 1
        const limit = this.queryStr?.size || 10
        const skip = limit*(page-1)
        this.query = this.query.skip(limit*(page-1)).limit(limit)
        // if(req?.query?.page){
        //  const movieCount = await Movie.countDocuments()
        //  if(skip>=movieCount){
        //      throw new Error('This page is not found')
        //  }
        // }
        return this
    }

}
module.exports = ApiFeatures