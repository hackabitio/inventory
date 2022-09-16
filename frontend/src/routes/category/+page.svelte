<script>
	import { enhance } from '$lib/form';
	export let data

	$: categories = Object.keys(data).map((key) => data[key])
	let filteredCategories = Object.keys(data).map((key) => data[key])

	let showNames = false
	let addName
	let categoryNameInput
	let selectedCategory = null
	let submitDisabled
	let uniqueNotice = false
	$: submitDisabled = !addName

	const findCategory = async (e) => {
		if (addName) {
			filteredCategories = categories.filter(category => category.name.toLowerCase().indexOf(addName.toLowerCase()) > -1)
			showNames = addName.length && filteredCategories.length
			uniqueNotice = categories.filter(cat => cat.name.toLowerCase() === addName.toLowerCase()).length
			submitDisabled = !addName || uniqueNotice
		}
	}

	let formDialogOpen = false

	const openDialog = e => {
		formDialogOpen = true
		setTimeout(() => {
			categoryNameInput.focus()
		}, 100)
	}

	const closeDialog = e => {
		if (e.key === 'Escape') {
			formDialogOpen = false
			selectedCategory = null
			document.querySelector('form').reset();
		}
	}
</script>

<svelte:head>
	<title>Add to stock</title>
	<meta name="description" content="Add to the stock" />
</svelte:head>
<svelte:window on:keydown={closeDialog} />

<div class="content">
	<h1>Categories</h1>

	<dialog open="{formDialogOpen}" on:close={() => formDialogOpen = false} id="favDialog">
		<form
						class="add-new-category"
						method="dialog"
						action="/category"
						use:enhance={{
							result: async ({ form }) => {
								form.reset();
							}
						}}
		>
			<h1>Add new category</h1>
			<label>
				Category name
				<input bind:this={categoryNameInput} autocomplete="off" type="text" id="addName" name="name" bind:value={addName} placeholder="Category name" on:keyup={findCategory} />
			</label>
			<div>
				<button value="cancel" type="reset" on:click={() => formDialogOpen = false}>Cancel</button>
				<button id="confirmBtn" value="default" type="submit" disabled={submitDisabled}>Add</button>
				{#if uniqueNotice }<span>Category already exists.</span>{/if}
			</div>
		</form>
	</dialog>
	<p>
		<button id="addToStock" on:click={openDialog}>Add category</button>
	</p>

	<table>
		<tr class="table-header">
			<th>ID</th>
			<th>Name</th>
			<th>Products</th>
			<th>Actions</th>
		</tr>
		{#each categories as category}
			<tr>
				<td>{category.id}</td>
				<td>{category.name}</td>
				<td>{category.products}</td>
				<td class="record-actions">
					<form
						action="/category?_method=DELETE"
						method="post"
						use:enhance={{
							pending: () => {
								category.pending_delete = true
								setTimeout(()=>{ category.pending_delete = false }, 3000)
							}
						}}
					>
						<input type="hidden" name="id" value={category.id} />
						<button class="icon-button" aria-label="Delete category" disabled={category.pending_delete} >
							<svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M5.13036 0.677727C5.33527 0.262356 5.75647 0 6.21563 0H10.7844C11.2435 0 11.6647 0.262356 11.8696 0.677727L12.1429 1.22596H15.7857C16.4574 1.22596 17 1.77496 17 2.45192C17 3.12888 16.4574 3.67788 15.7857 3.67788H1.21429C0.543772 3.67788 0 3.12888 0 2.45192C0 1.77496 0.543772 1.22596 1.21429 1.22596H4.85714L5.13036 0.677727ZM1.18013 4.90385H15.7857V17.1635C15.7857 18.5159 14.6967 19.6154 13.3571 19.6154H3.60871C2.30145 19.6154 1.18013 18.5159 1.18013 17.1635V4.90385ZM4.21585 7.96875V16.5505C4.21585 16.8876 4.52321 17.1635 4.82299 17.1635C5.19107 17.1635 5.43013 16.8876 5.43013 16.5505V7.96875C5.43013 7.63161 5.19107 7.35577 4.82299 7.35577C4.52321 7.35577 4.21585 7.63161 4.21585 7.96875ZM7.85871 7.96875V16.5505C7.85871 16.8876 8.16607 17.1635 8.46585 17.1635C8.83393 17.1635 9.10714 16.8876 9.10714 16.5505V7.96875C9.10714 7.63161 8.83393 7.35577 8.46585 7.35577C8.16607 7.35577 7.85871 7.63161 7.85871 7.96875ZM11.5357 7.96875V16.5505C11.5357 16.8876 11.8089 17.1635 12.1429 17.1635C12.4768 17.1635 12.75 16.8876 12.75 16.5505V7.96875C12.75 7.63161 12.4768 7.35577 12.1429 7.35577C11.8089 7.35577 11.5357 7.63161 11.5357 7.96875Z" fill="black"/>
							</svg>
						</button>
					</form>
					<button class="icon-button" aria-label="Update category" on:click={() => selectedCategory = category}>
						<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13.474 0.696554C14.4028 -0.232185 15.911 -0.232185 16.8398 0.696554L18.3035 2.16148C19.2322 3.08992 19.2322 4.59683 18.3035 5.52564L16.5054 7.32383L11.676 2.49474L13.474 0.696554ZM15.6659 8.16347L7.00263 16.8237C6.61628 17.2101 6.13706 17.4962 5.61325 17.6485L1.14308 18.9637C0.830278 19.0566 0.491848 18.9711 0.261151 18.7074C0.0304466 18.5105 -0.0558067 18.1724 0.0362493 17.8566L1.35111 13.3871C1.50565 12.8633 1.7891 12.384 2.17583 11.9976L10.8364 3.33513L15.6659 8.16347Z" fill="black"/>
						</svg>
					</button>
				</td>
			</tr>
		{/each}
	</table>
	{#if selectedCategory}
		<dialog open="{selectedCategory}" on:close={() => selectedCategory = null} id="updateDialog">
			<form
				class="add-new-category"
				method="dialog"
				action="/category?_method=PATCH"
				use:enhance={{
					result: async ({ form }) => {
						form.reset();
					}
				}}
			>
				<h1>Update category</h1>
				<input type="hidden" name="newId" value={selectedCategory.id} />
				<label>
					Category name
					<input autocomplete="off" type="text" id="newName" name="newName" bind:value={selectedCategory.name} placeholder="Category name" />
				</label>
				<div>
					<button value="cancel" type="reset" on:click={() => selectedCategory = null}>Cancel</button>
					<button id="updateBtn" value="default" type="submit" disabled={!selectedCategory.name.length}>Update</button>
				</div>
			</form>
		</dialog>
	{/if}
</div>

<style lang="scss">
	.add-new-category {
		display: flex;
		flex-direction: column;
	}

	.add-new-category label {
		display: grid;
		grid-template-columns: 1fr 4fr;
		position: relative;
		text-align: right;
		grid-gap: 10px;
		margin-bottom: 10px;
	}

</style>
