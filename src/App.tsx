import { gql, useMutation, useQuery } from '@apollo/client'
import './App.scss'
import { useState } from 'react'

type SortCriteria = {
	sortCriteria: {
		order: 'ASC' | 'DESC'
		field: string
	}
}

const GET_BOOKS = gql`
	query getMyBooks($sort: SortInput) {
		getBooks(sort: $sort) {
			name
			id
			authorId
		}
	}
`

const ADD_BOOK = gql`
	mutation AddBook($name: String!, $authorId: Int!) {
		addBook(name: $name, authorId: $authorId) {
			name
			id
		}
	}
`

type Book = {
	name: string
	id: string
	authorId: number
}

type BooksData = {
	getBooks: Book[]
}

function App() {
	const [sortCriteria, setSortCriteria] = useState<SortCriteria>({
		sortCriteria: {
			order: 'ASC',
			field: 'id'
		}
	})

	const [authorId, setAuthorId] = useState<number>(-1)
	const [bookName, setBookName] = useState<string>('')

	const { loading, error, data } = useQuery<BooksData, { sort: SortCriteria }>(GET_BOOKS, {
		variables: { sort: { ...sortCriteria } }
	})

	const [addBookMutation, { loading: addLoading, error: addError }] = useMutation(ADD_BOOK, {
		refetchQueries: [{ query: GET_BOOKS, variables: { sort: sortCriteria } }]
	})

	const onToggleSort = () => {
		setSortCriteria({
			sortCriteria: {
				...sortCriteria.sortCriteria,
				order: sortCriteria.sortCriteria.order === 'ASC' ? 'DESC' : 'ASC'
			}
		})
	}

	const onAddBook = () => {
		addBookMutation({ variables: { name: bookName, authorId } })
	}

	console.log(loading, error, data)

	if (loading) return <>Loading</>
	if (error) return <>Error</>

	if (!data) return <>No data</>

	return (
		<>
			{addLoading && !addError && <div>Adding Book Data. Please wait...</div>}
			<button onClick={onToggleSort}>Toggle Sort</button>
			{data.getBooks.map(book => (
				<div key={book.id}>
					{book.id} - {book.name} - {book.authorId}
				</div>
			))}
			<div>
				<input type="text" placeholder="Enter Author Id" onChange={e => setAuthorId(Number(e.target.value))} />
				<input type="text" placeholder="Enter Book Name" onChange={e => setBookName(e.target.value)} />
				<button onClick={onAddBook}>Add Book</button>
			</div>
		</>
	)
}

export default App
