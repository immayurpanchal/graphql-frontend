import { gql, useQuery } from '@apollo/client'
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
		}
	}
`

type Book = {
	name: string
	id: string
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

	const { loading, error, data } = useQuery<BooksData, { sort: SortCriteria }>(GET_BOOKS, {
		variables: { sort: { ...sortCriteria } }
	})

	const onToggleSort = () => {
		setSortCriteria({
			sortCriteria: {
				...sortCriteria.sortCriteria,
				order: sortCriteria.sortCriteria.order === 'ASC' ? 'DESC' : 'ASC'
			}
		})
	}

	console.log(loading, error, data)

	if (loading) return <>Loading</>
	if (error) return <>Error</>

	if (!data) return <>No data</>

	return (
		<>
			<button onClick={onToggleSort}>Toggle Sort</button>
			{data.getBooks.map(book => (
				<div key={book.id}>
					{book.id} - {book.name}
				</div>
			))}
		</>
	)
}

export default App
