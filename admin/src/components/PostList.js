/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Modal, Table } from 'reactstrap'
import * as PostApi from '../api/post'

export class PostList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      posts: [],
      modal: false
    }
  }

  componentWillMount () {
    this.fetchPosts()
  }

  render () {
    return (
      <div className="PostList">
        <div className="container content">

          <div className="button-area">
            <Button block>New Post</Button>
          </div>

          <Table hover>
            <caption>List of posts</caption>
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
              </tr>
            </thead>
            <tbody>
              {this.state.posts.map((post) =>
                <tr key={post.slug} onClick={() => this.props.history.push(`/posts/${post.slug}`)}>
                  <th scope="row">{post._id}</th>
                  <td>{post.title}</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Modal isOpen={ this.state.modal }>
          </Modal>

        </div>
      </div>
    )
  }

  async fetchPosts () {
    try {
      const data = await PostApi.getPosts()
      this.setState({posts: data.posts})
    } catch (err) {
      alert(err)
    }
  }
}

export default PostList
