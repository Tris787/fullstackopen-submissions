import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log('Create Function')
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (updateBlogId, updateBlog) => {
  const response = await axios.put(`${baseUrl}/${updateBlogId}`, updateBlog)
  return response.data
}

const deleteBlog = async (deleteBlogId) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${deleteBlogId}`, config)
  return response
}

const getBlogComments = async (blogId) => {
  const response = await axios.get(`${baseUrl}/${blogId}/comments`)
  return response.data
}

const createBlogComment = async (blogId, newComment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, newComment)
  return response.data
}

export default {
  getAll,
  create,
  setToken,
  update,
  deleteBlog,
  getBlogComments,
  createBlogComment,
}
