from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from datetime import date
import uuid
from datetime import datetime


# TODO: Total number of cycles will not be saved in DB.
# Instead, it should be calculated adding up all number_of_cycles in Production Cycles
# TODO: Stencil's isUsable will not be saved in DB.
# It will come from last run analysis: StencilTensionValues, AperturesInspection or PerfilometerInspection

class Configurations(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date_to_review = models.DateField(default="2024-09-08")

class Stencil(models.Model):
    stencil_id = models.BigIntegerField(primary_key=True)
    site_id = models.CharField(max_length=10, null=True, blank=True)
    stencil_part_nbr = models.CharField(max_length=50, null=True, blank=True)
    vendor_part_nbr = models.CharField(max_length=50, null=True, blank=True)
    vendor = models.CharField(max_length=50)
    mfg_date = models.DateTimeField(null=True)
    product_type = models.CharField(max_length=10, null=True, blank=True)
    thickness = models.CharField(max_length=10)
    pcb_up_nbr = models.IntegerField()
    location = models.CharField(max_length=10, null=True)
    status = models.CharField(max_length=10)
    life_limit = models.IntegerField()
    counter = models.IntegerField()
    trigger_err_limit = models.IntegerField()
    reg_date_time = models.DateTimeField(null=True, blank=True)
    reg_user_id = models.CharField(max_length=10, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    update_user_id = models.CharField(max_length=10, null=True, blank=True)
    datetime = models.DateTimeField(null=True, blank=True)
    revision = models.CharField(max_length=10, null=True, blank=True)
    side = models.CharField(max_length=10, null=True, blank=True)
    label_info = models.TextField(null=True, blank=True)
    is_active_in_use = models.BooleanField()
    stencil_destination = models.CharField(max_length=100)
    p1_value = models.FloatField()
    p2_value = models.FloatField()
    p3_value = models.FloatField()
    p4_value = models.FloatField()
    is_blocked_stencil = models.BooleanField()
    index_of_suggested_stencil = models.IntegerField()
    object_status = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
         return self.stencil_part_nbr

class ProcessedImage(models.Model):
    stencil = models.ForeignKey(Stencil, null=True, on_delete=models.SET_NULL)
    image_path = models.CharField(max_length=255)
    scratch_count = models.IntegerField()
    p1 = models.FloatField(null= True, default=0)
    p2 = models.FloatField(null= True, default=0)
    p3 = models.FloatField(null= True, default=0)
    p4 = models.FloatField(null= True, default=0)

    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        
        return self.image_path

class StencilType(models.Model):
    npi = models.CharField(max_length=50)
    replica = models.BooleanField(default=False)
    revision = models.BooleanField(default=False)
    def __str__(self) -> str:
        return self.npi


class ParameterTension(models.Model):
    
    min_value= models.FloatField(null= True, default=0) 
    max_value = models.FloatField(null= True, default=0)
    scratch_value = models.FloatField(null= True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)  # Opção 1 (recomendada)  # Sem auto_now_add
    def __str__(self) -> str:
        return self.parameter

class StencilTensionValues(models.Model):
    p1 = models.FloatField()
    p2 = models.FloatField()
    p3 = models.FloatField()
    p4 = models.FloatField()

    responsable = models.CharField(null=True, blank=True,max_length=50)

    path_p1 = models.CharField(null=True,max_length=255)
    path_p2 = models.CharField(null=True,max_length=255)
    path_p3 = models.CharField(null=True,max_length=255)
    path_p4 = models.CharField(null=True,max_length=255)
    
    measurement_datetime = models.DateTimeField()
    is_registration_measurement = models.BooleanField()
    is_approved_status = models.BooleanField()
    is_pending_measurement = models.BooleanField(default=False)
    cicles = models.FloatField(null=True)
    stencil_id = models.ForeignKey(
        "Stencil",
        on_delete=models.SET_NULL,
        null=True,
    )

    # def __str__(self) -> str:
    #     return self.measurement_datetime

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O campo email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    first_name = models.TextField(null=False, default=None)
    last_name = models.TextField(null=False, default=None)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'

