<?php
if (!defined('ABSPATH')) exit;
get_header(); ?>
<main class="site-main"><div class="container"><section class="hero"><span>HIREHUB</span><h1>Find your next opportunity.</h1><p>Search jobs, discover companies and apply with confidence.</p><a class="hh-button" href="<?php echo esc_url(home_url('/jobs/')); ?>">Explore Jobs</a></section><?php echo do_shortcode('[hirehub_jobs]'); ?></div></main>
<?php get_footer();
