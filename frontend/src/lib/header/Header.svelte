<script>
	import { page } from '$app/stores';
</script>

<header class="no-print">
	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === '/'}>
				<a sveltekit:prefetch href="/">Available</a>
			</li>
			<li class:active={$page.url.pathname === '/add'}>
				<a sveltekit:prefetch href="/add">Add</a>
			</li>
			<li class:active={$page.url.pathname === '/info'}>
				<a sveltekit:prefetch href="/info">Info</a>
			</li>
			<li class:active={$page.url.pathname === '/deduct'}>
				<a sveltekit:prefetch href="/deduct">Release</a>
			</li>
			<li class:active={$page.url.pathname === '/category'}>
				<a sveltekit:prefetch href="/category">Categories</a>
			</li>
			<li class="hide-in-mobile" class:active={$page.url.pathname === '/print'}>
				<a sveltekit:prefetch href="/print">Print</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

</header>

<style lang="scss">
	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;

		@media only screen and (min-width: 451px) {
			font-size: 0.8rem;
		}
	}

	a:hover {
		color: var(--accent-color);
	}

	@media only screen and (max-width: 450px) {
		.hide-in-mobile {
			display: none;
		}
	}
</style>
