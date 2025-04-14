"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, CheckSquare, CheckIcon } from "lucide-react";

import { permissionCategories, getPermissionDescription } from "../permissions-data";

type PermissionListProps = {
  selectedPermissions: Record<string, boolean>;
  onChange: (permissionId: string, checked: boolean, bulkUpdate?: Record<string, boolean>) => void;
};

export function PermissionList({ 
  selectedPermissions, 
  onChange, 
}: PermissionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Check if all permissions are selected
  const areAllPermissionsSelected = () => {
    // Count total available permissions
    const totalPermissions = permissionCategories.reduce(
      (total, category) => total + category.permissions.length,
      0
    );
    
    // Count how many are checked
    const selectedCount = Object.values(selectedPermissions).filter(Boolean).length;
    
    return selectedCount === totalPermissions && totalPermissions > 0;
  };

  // Toggle all permissions
  const handleToggleAll = () => {
    // Create a new permissions object with all values set at once
    const updatedPermissions = { ...selectedPermissions };
    const newValue = !areAllPermissionsSelected();
    
    // Update all permissions in the updatedPermissions object
    permissionCategories.forEach(category => {
      category.permissions.forEach(permission => {
        updatedPermissions[permission.id] = newValue;
      });
    });
    
    // Call onChange with a special flag to indicate a bulk update
    onChange("__all__", newValue, updatedPermissions);
  };

  // Filter categories based on search
  const filteredCategories = permissionCategories.map(category => ({
    ...category,
    permissions: category.permissions.filter(permission => 
      searchTerm.trim() === "" || 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPermissionDescription(permission.id).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.permissions.length > 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-muted/50"
            placeholder="Rechercher des permissions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs flex items-center gap-1 h-7"
            onClick={handleToggleAll}
          >
            {areAllPermissionsSelected() ? (
              <>
                <X className="h-3.5 w-3.5" />
                Tout décocher
              </>
            ) : (
              <>
                <CheckSquare className="h-3.5 w-3.5" />
                Tout cocher
              </>
            )}
          </Button>
        </div>
      </div>
      
      {filteredCategories.map(category => (
        <div key={category.id} className="space-y-1">
          <h3 className="text-base font-semibold mb-2">
            {category.name}
          </h3>
          
          <div className="space-y-0">
            {category.permissions.map(permission => (
              <div 
                key={permission.id} 
                className="flex items-start justify-between py-3 px-2 hover:bg-muted/60 rounded transition-colors cursor-pointer"
                onClick={() => {
                  const newValue = !selectedPermissions[permission.id];
                  onChange(permission.id, newValue);
                }}
              >
                <div className="space-y-1 flex-1 pr-4">
                  <p className="text-sm font-medium">{permission.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getPermissionDescription(permission.id)}
                  </p>
                </div>
                
                <div 
                  className={`w-6 h-6 flex items-center justify-center rounded cursor-pointer ${
                    selectedPermissions[permission.id] ? 'bg-blue-500' : 'bg-zinc-700'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const newValue = !selectedPermissions[permission.id];
                    onChange(permission.id, newValue);
                  }}
                >
                  {selectedPermissions[permission.id] && (
                    <CheckIcon className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 