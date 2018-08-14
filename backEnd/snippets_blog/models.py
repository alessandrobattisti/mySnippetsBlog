from django.db import models
from django.utils import timezone
import markdown
from django.template.defaultfilters import slugify
from django.urls import reverse
import tsvector_field

# Create your models here.
class Comment(models.Model):
    author = models.CharField(max_length=255)
    content = models.TextField()
    created = models.DateTimeField(auto_now=True)
    reply_to = models.IntegerField(null=True, blank=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)

    def __str__(self):
        return self.author

    class Meta:
        verbose_name="Comment"
        verbose_name_plural="Comments"
        ordering=["created"]

class Tag(models.Model):
    tag=models.CharField(max_length=255,unique=True)

    def _post_number(self):
        return Post.objects.filter(tags=self).count()
    post_number=property(_post_number)

    def _categories(self):
        return self.category_set.all()
    categories=property(_categories)

    def __str__(self):
        return self.tag


class Category(models.Model):
    category=models.CharField(max_length=255,unique=True)
    tags=models.ManyToManyField(Tag,null=True, blank=True)

    def __str__(self):
        return self.category

class PostAbstract(models.Model):
    title=models.CharField(max_length=255)
    content=models.TextField()
    published=models.BooleanField(default=False)
    created=models.DateTimeField(null=True, blank=True)
    modified=models.DateTimeField(null=True, blank=True)
    tags=models.ManyToManyField(Tag)
    slug=models.SlugField(unique=True,null=True, blank=True)
    search = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('title', 'A'),
        tsvector_field.WeightedColumn('content', 'D'),
    ], 'english')

    def __str__(self):
        return self.title + " " + self.slug

    def _html(self):
        return markdown.markdown(self.content)

    html=property(_html)

    def get_absolute_url(self):
        return reverse('post', kwargs={'slug':self.slug})

    @classmethod
    def unique_slug(cls, slug, n=1):
        if cls.objects.filter(slug=slug):
            if n>1:
                slug=slug[0:-len(str(n-1))]+str(n)
            else:
                slug+=str(n)
            return cls.unique_slug(slug,n+1)
        else:
            return slug

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = timezone.now()
            self.slug = self.unique_slug(slugify(self.title))
        if not self.slug:
            self.slug = self.unique_slug(slugify(self.title))

        self.modified = timezone.now()
        return super(PostAbstract, self).save(*args, **kwargs)

    class Meta:
        abstract=True


class Post(PostAbstract):
    class Meta:
        verbose_name="Post"
        verbose_name_plural="Posts"
        ordering=["-modified"]


from django.db.models.signals import post_delete, post_save, m2m_changed

from django.dispatch import receiver
@receiver(post_delete, sender=Post)
@receiver(post_save, sender=Post)
def delete_unused_tags_and_cat(sender, **kwargs):
    tags=Tag.objects.all()
    for tag in tags:
        if tag.post_number==0:
            tag.delete()
    cats = Category.objects.all()
    for c in cats:
        if c.tags.count() == 0:
            c.delete()

@receiver(m2m_changed, sender=Post.tags.through)
def delete_unused_tags2(sender, **kwargs):
    action = kwargs.get('action','')
    if action == 'post_add':
        tags=Tag.objects.all()
        for tag in tags:
            #print(tag, tag.post_number)
            if tag.post_number==0:
                tag.delete()
