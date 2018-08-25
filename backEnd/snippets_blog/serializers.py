import os
import json
import markdown
import requests
from .models import Post, Tag, Category, Comment
from rest_framework import serializers
from rest_framework.exceptions import APIException

G_REC = os.environ['RECAPTCHA_SECRET']

class TagSerializer(serializers.ModelSerializer):
    tag = serializers.CharField()
    class Meta:
        model = Tag
        fields = ('tag',)

class CategorySerializer(serializers.ModelSerializer):
    category = serializers.CharField()
    class Meta:
        model = Category
        fields = ('category',)

class EditTagSerializer(serializers.ModelSerializer):
    tag = serializers.CharField()
    categories = CategorySerializer(many=True)
    class Meta:
        model = Tag
        fields = ('tag','categories')

    def update(self, instance, validated_data):
        #If user renamed tag to an existing replace this tag with the existing one
        #in all posts and remove the renamed tag
        #do not edit categories
        if instance.tag != validated_data['tag']:
            tags = Tag.objects.filter(tag=validated_data['tag'])
            if tags.count() > 0:
                old_tag = tags[0]
                posts = Post.objects.filter(tags=instance)
                for post in posts:
                    post.tags.remove(instance)
                    post.tags.add(old_tag)
                    post.save()

                instance.delete()
                return old_tag

        instance.tag=validated_data['tag']

        categories = validated_data.pop('categories', [])
        for cat in categories:
            cat = cat['category'].strip()
            c=Category.objects.filter(category=cat)
            if c.count()==0:
                c=Category.objects.create(category=cat)
            else:
                c=Category.objects.get(category=cat)
            c.tags.add(instance)
            c.save()

        instance.save()

        #remove categories
        old_cat = [a.category for a in instance.categories]
        new_cat = [a['category'] for a in categories]
        to_del = list(set(old_cat).difference(set(new_cat))) #cat in old_cat but not in new_cat
        for cat in to_del:
            c=Category.objects.get(category=cat)
            c.tags.remove(instance)
            c.save()
            if c.tags.count() == 0:
                c.delete()


        return instance


class NoGoogleKey(APIException):
    status_code = 503
    default_detail = 'no key'
    default_code = 'no key'
class NoGoogleKey2(APIException):
    status_code = 503
    default_detail = 'no key2'
    default_code = 'no key2'

class CommentSerializer(serializers.ModelSerializer):
    google_auth = serializers.CharField(write_only=True)
    class Meta:
        model = Comment
        fields =  '__all__'

    def create(self, validated_data):
        g_auth = validated_data.pop('google_auth', False)
        if g_auth:

            res = requests.post('https://www.google.com/recaptcha/api/siteverify', {
                'secret': G_REC,
                'response': g_auth
            })
            return_values = json.loads(res.content.decode())
            return_code = return_values.get("success", False)
            if return_code:
                author = validated_data['author']
                content = validated_data['content']
                reply_to = validated_data['reply_to']
                post = validated_data['post']
                #com=Comment.objects.create(**validated_data)
                com=Comment.objects.create(author=author, content=content, reply_to=reply_to, post=post)
                #com.post.add(Post.objects.get(pk=post))
                return com

        raise NoGoogleKey


class ListPostSerializer(serializers.ModelSerializer):
    tags=TagSerializer(many=True)
    html = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()

    class Meta:
        model = Post
        depth = 2
        fields = ('title','content','created','tags','slug','html')

    def get_html(self,obj):
        return obj.html

    def get_created(self,obj):
        return obj.created.strftime('%Y-%m-%d %H:%M')

class EditPostSerializer(serializers.ModelSerializer):
    tags=TagSerializer(many=True)
    html = serializers.SerializerMethodField()
    created = serializers.SerializerMethodField()
    def get_created(self,obj):
        return obj.created.strftime('%Y-%m-%d %H:%M')

    def get_html(self,obj):
        return obj.html

    def create(self, validated_data):
        tags = validated_data.pop('tags', [])
        #print(tags)
        post=Post.objects.create(**validated_data)
        for tag in tags:
            t=Tag.objects.filter(tag=tag['tag'].strip())
            if t.count()==0:
                t=Tag.objects.create(tag=tag['tag'].strip())
            else:
                t=Tag.objects.get(tag=tag['tag'].strip())
            post.tags.add(t)
        post.save()
        return post

    def update(self, instance, validated_data):
        instance.title=validated_data['title']
        instance.content=validated_data['content']
        instance.published=validated_data['published']
        tags = validated_data.pop('tags', [])

        instance.tags.clear()
        for tag in tags:
            t=Tag.objects.filter(tag=tag['tag'].strip())
            if t.count()==0:
                t=Tag.objects.create(tag=tag['tag'].strip())
            else:
                t=Tag.objects.get(tag=tag['tag'].strip())
            instance.tags.add(t)
        instance.save()

        return instance

    class Meta:
        model = Post
        depth = 2
        read_only_fields = ('slug','pk','html','created')
        fields = ('title','content','tags','published','slug','pk','html','created')
