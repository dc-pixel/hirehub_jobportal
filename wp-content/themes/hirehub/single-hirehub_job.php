<?php
if (!defined('ABSPATH')) exit;
get_header(); ?>
<main class="site-main"><div class="container"><article class="job-single"><p class="eyebrow">Job opening</p><h1><?php the_title(); ?></h1><div class="job-meta"><span><?php echo esc_html(get_post_meta(get_the_ID(),'_company',true)); ?></span><span><?php echo esc_html(get_post_meta(get_the_ID(),'_location',true)); ?></span><span><?php echo esc_html(get_post_meta(get_the_ID(),'_experience',true)); ?></span><span><?php echo esc_html(get_post_meta(get_the_ID(),'_salary',true)); ?></span></div><?php the_content(); ?><h3>Skills</h3><p><?php echo esc_html(get_post_meta(get_the_ID(),'_skills',true)); ?></p><a class="hh-button" href="<?php echo esc_url(home_url('/apply/?job_id='.get_the_ID())); ?>">Apply for this job</a></article></div></main>
<?php get_footer();
