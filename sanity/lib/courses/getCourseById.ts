import { client } from '../client'

async function getCourseById(id: string) {
  try {
    const course = await client.fetch(`
      *[_type == "course" && _id == $id][0] {
        _id,
        title,
        description,
        slug,
        image,
        category->{
          _id,
          name,
          slug
        },
        instructor->{
          _id,
          name
        },
        "modules": modules[]-> {
          _id,
          title,
          "lessons": lessons[]-> {
            _id,
            title,
            slug,
            duration
          }
        }
      }
    `, { id })
    
    return course
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  }
}

export default getCourseById
